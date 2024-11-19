const db = require("../db/db")
let sql;

const addProduct = (productName, description, brand, imageData, sku, price, date) => {
    return new Promise((resolve, reject) => {
        description = formatLineBreaks(description);
        const slug = slug(productName);
        sql = `
        INSERT INTO products 
        (productName, description, brand, img, sku, price, date, slug)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
      db.run(sql, [productName, description, brand, imageData, sku, price, date, slug], (err) => {
        if (err) {
            console.error(err.message)
            reject(err)
        }
        else {
          resolve();
        }
      });
    })
}

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
        FROM products;`

        db.all(sql, [], (err, rows) => {
            if (err){
                console.error(err.message)
                reject(err)
            }
            else{
                resolve(rows)
            }
        })
    })
}

const getSingleProduct = (id) => {
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
        WHERE id = ?;`;

        db.all(sql, [id], (err, rows) => {
            if (err){
                console.log(err.message)
                reject(err)
            } else{
                resolve(rows);
            }
        })
    })
};

const deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        if(!id){
            const err = {message: "ID is undefined"}
            reject(err)
        }
        sql = `DELETE FROM products WHERE id = ?`
    
        db.run(sql, [id], (err) => {
            if (err) {
                console.error(err.message)
                reject(err)
            }else{
                resolve()
            }
        })
    })
}

function formatLineBreaks(text){
    return text.replace(/(\r\n|\n)/g, '<br>')
}

function slug(text){
    return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

module.exports = {
    addProduct,
    deleteProduct,
    getAllProducts,
    getSingleProduct
}