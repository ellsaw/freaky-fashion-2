const express = require('express');
const router = express.Router();
const models = require("../models/models")

router.get("/:slug", async (req, res, next) => {
    try{
        const product = await models.getSingleProduct(req.params.slug)

        const slideShowProducts = await models.getRandomProducts(8)
        res.render('product-details', { product, slideShowProducts })
    }catch(err) {
        res.redirect('/');
        console.error(err.message)
    }
    
})

module.exports = router;