const { query } = require("express");
const db = require("../db/db");
const bufferToImg = require("../utils/bufferToImg");
const Fuse = require('fuse.js')
let sql;

const addProduct = async (
  productName,
  description,
  brand,
  imageData,
  sku,
  price,
  date
) => {
  return new Promise(async (resolve, reject) => {
    description = formatLineBreaks(description);
    const slug = await slugify(productName, brand);
    console.log(slug);

    if (!slug) {
      const err = { message: "URL Slug could not be created" };
      console.log(err.message);
      reject(err);
    }

    sql = `
        INSERT INTO products 
        (productName, description, brand, img, sku, price, date, slug)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
    db.run(
      sql,
      [productName, description, brand, imageData, sku, price, date, slug],
      (err) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
};

const getProducts = (amount) => {
  return new Promise((resolve, reject) => {
    sql = `SELECT 
        id, 
        productName, 
        description,
        brand, 
        sku, 
        price,
        img, 
        date,
        slug 
        FROM products
        ORDER BY id DESC
        LIMIT ?;`;

    db.all(sql, [amount], (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        rows.forEach((row) => {
          row.img = bufferToImg(row.img);
        });
        resolve(rows);
      }
    });
  });
};

const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    sql = `SELECT 
        id, 
        productName, 
        description,
        brand, 
        sku, 
        price,
        img, 
        date,
        slug 
        FROM products
        ORDER BY id DESC;`;

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        rows.forEach((row) => {
          row.img = bufferToImg(row.img);
        });
        resolve(rows);
      }
    });
  });
};

const getSingleProduct = (slug) => {
  return new Promise((resolve, reject) => {
    sql = `SELECT 
        id, 
        productName, 
        description,
        brand, 
        sku, 
        price,
        img, 
        date,
        slug 
        FROM products
        WHERE slug = ?;`;

    db.get(sql, [slug], (err, row) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        row.img = bufferToImg(row.img);
        resolve(row);
      }
    });
  });
};

const getRandomProducts = (amount) => {
  return new Promise((resolve, reject) => {
    sql = `SELECT 
        id, 
        productName, 
        description,
        brand, 
        sku, 
        price,
        img, 
        date,
        slug 
        FROM products
        ORDER BY RANDOM() LIMIT ?;`;

    db.all(sql, [amount], (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        rows.forEach((row) => {
          row.img = bufferToImg(row.img);
        });
        resolve(rows);
      }
    });
  });
};

const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    sql = `DELETE FROM products WHERE id = ?`;

    db.run(sql, [id], (err) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

const searchResults = (query) => {
  return new Promise((resolve, reject) => {
    sql = `
    SELECT
    id,
    productName,
    brand
    FROM products
    `
    db.all(sql, [], (err, rows) => {
      if (err){
        console.error(err.message)
        reject(err)
      }else{
        const fuseOptions = {
          keys: ['id', 'productName', 'brand'],
          threshold: 0.3
        }

        const fuse = new Fuse(rows, fuseOptions)
        const fuseResults = fuse.search(query).map(result => result.item)

        const searchPromises = fuseResults.map(fuseResult => {
          return new Promise((resolve, reject) => {
            const sql = `
              SELECT 
                id, 
                productName, 
                description,
                brand, 
                sku, 
                price,
                img, 
                date,
                slug 
              FROM products
              WHERE id = ?
              ORDER BY id DESC;
            `;

            db.get(sql, fuseResult.id, (err, row) => {
              if (err) {
                return reject(err);
              }
              resolve(row);
            });
          });
        });

        
        Promise.all(searchPromises)
          .then(searchResults => {
            searchResults.forEach(searchResult => {
              searchResult.img = bufferToImg(searchResult.img)
            });
            resolve(searchResults);
          })
          .catch(err => {
            reject(err);
          });
      }
    })
  })
}

function formatLineBreaks(text) {
  return text.replace(/(\r\n|\n)/g, "<br>");
}

const checkSlugDuplicate = (slug) => {
  return new Promise((resolve, reject) => {
    sql = `SELECT COUNT(*) AS count FROM products WHERE slug = ?`;
    db.get(sql, [slug], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.count > 0);
      }
    });
  });
};

function toSlug(text) {
  const aToZText = text
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/&/g, "and");

  return aToZText
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/--+/g, "-");
}

async function slugify(text, brand) {
  let slug = `${toSlug(brand)}-${toSlug(text)}`;
  try {
    let isDuplicate = await checkSlugDuplicate(slug);

    let counter = 1;
    while (isDuplicate) {
      let originalSlug = slug;
      slug = `${originalSlug}-${counter}`;
      isDuplicate = await checkSlugDuplicate(slug);
      counter++;
    }
    return slug;
  } catch (err) {
    console.error(err.message);
    return undefined;
  }
}

module.exports = {
  addProduct,
  deleteProduct,
  getProducts,
  getAllProducts,
  getSingleProduct,
  getRandomProducts,
  searchResults,
};
