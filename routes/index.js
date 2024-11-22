const express = require('express');
const router = express.Router();
const models = require("../models/models")

/* GET home page. */
router.get('/', async (req, res, next) => {
    try{
        let rows = await models.getProducts(8)

        res.render('index', { products: rows });
    }catch(err){
        res.render("error", { error: err, message: err.message})
    }
});

module.exports = router;
