const express = require('express');
const router = express.Router();
const models = require("../models/models")


router.get("/", async (req, res) => {
    const products = await models.searchResults(req.query.q);

    res.render("search", { products, query: req.query.q })
})

module.exports = router;