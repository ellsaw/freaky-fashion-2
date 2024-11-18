const db = require("../db/db")
let sql;

const addProduct = (productName, description, brand, imageData, sku, price, date, callback) => {
    return new Promise((resolve, reject) => {
        sql = `
        INSERT INTO products 
        (productName, description, brand, img, sku, price, date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
      db.run(sql, [productName, description, brand, imageData, sku, price, date], (err) => {
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
        date 
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

module.exports = {
    addProduct,
    deleteProduct,
    getAllProducts,
}