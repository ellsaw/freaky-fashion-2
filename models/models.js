const db = require("../db/db");
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
    console.log(slug)

    if(!slug){
        reject(err.message = "URL Slug could not be created")
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
        FROM products;`;

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
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
        console.log(err.message);
        reject(err);
      } else {
        resolve(row);
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

function formatLineBreaks(text) {
  return text.replace(/(\r\n|\n)/g, "<br>");
}

const checkSlugDuplicate = (slug) => {
    return new Promise((resolve, reject) => {
      sql = `SELECT COUNT(*) AS count FROM products WHERE slug = ?`;
      db.get(sql, [slug], (err, row) => {
          if (err){
              reject(err)
          }else{
              resolve(row.count > 0)
          }
      })
    });
  };

  function toSlug (text){
    const aToZText = text
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o");

    return aToZText
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/--+/g, "-");
  }

async function slugify(text, brand) {
    let slug = `${toSlug(brand)}-${toSlug(text)}`
    try{
        let isDuplicate = await checkSlugDuplicate(slug)

        let counter = 1;
        while(isDuplicate){
            let originalSlug = slug;
            slug = `${originalSlug}-${counter}`
            isDuplicate = await checkSlugDuplicate(slug)
            counter++;
        }
        return slug;
    }catch(err){
        console.log(err.message)
        return(undefined)
    }
}

module.exports = {
  addProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
};
