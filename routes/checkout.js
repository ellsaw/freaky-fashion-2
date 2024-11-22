const express = require('express');
const router = express.Router();
const models = require("../models/models")


router.get('/', (req, res, next) => {
        res.render('checkout', {});
});

module.exports = router;
