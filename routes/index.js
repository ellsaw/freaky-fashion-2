const express = require('express');
const router = express.Router();
const models = require("../models/models")
const bufferToImg = require("../utils/bufferToImg")

/* GET home page. */
router.get('/', async (req, res, next) => {
    try{
        let rows = await models.getAllProducts()
        rows.forEach(row => {
            row.img = bufferToImg(row.img);
        });
        res.render('index', { products: rows });
    }catch(err){
        res.render("error", { error: err, message: err.message})
    }
});

module.exports = router;
