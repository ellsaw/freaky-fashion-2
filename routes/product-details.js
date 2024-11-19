const express = require('express');
const router = express.Router();
const models = require("../models/models")
const bufferToImg = require("../utils/bufferToImg")

router.get("/:slug", async (req, res, next) => {
    try{
        const product = await models.getSingleProduct(req.params.slug)
        product.img = bufferToImg(product.img)

        const slideShowProducts = await models.getRandomProducts(8)
        slideShowProducts.forEach(product => {
            product.img = bufferToImg(product.img)
        });

        res.render('product-details', { product, slideShowProducts })
    }catch(err) {
        res.redirect('/');
        console.error(err.message)
    }
    
})

module.exports = router;