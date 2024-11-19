const express = require('express');
const router = express.Router();
const models = require("../models/models")
const bufferToImg = require("../utils/bufferToImg")

router.get("/:id", async (req, res, next) => {
    try{
        const rows = await models.getSingleProduct(req.params.id)
        const product = rows[0];
        product.img = bufferToImg(product.img)
        res.render('product-details', { product })
    }catch(err) {
        res.redirect('/');
        console.error(err.message)
    }
    
})

module.exports = router;