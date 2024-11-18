const express = require("express");
const router = express.Router();
const models = require("../../models/models")
const multer = require("multer")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.get("/", (req, res, next) => {
  res.render("admin/products", { error: undefined });
});

router.get("/fetch", async (req, res) => {
  try{
    const rows = await models.getAllProducts();
    res.json({ products: rows })
  }catch(err){
    res.render("admin/products", { error: err.message })
  }
});

router.get("/new", (req, res, next) => {
  res.render("admin/new", { products: "", error: undefined});
});

router.post("/new", upload.single("img"), async (req, res) => {
    const { productName, description, brand, img, sku, price, date } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image." });
    }
    
    const imageData = req.file.buffer;

    try {
      await models.addProduct(productName, description, brand, imageData, sku, price, date);
      res.status(200).json({ success: true });
    } catch (err) {
      console.log("Error adding product:", err);
      res.status(500).json({ error: err.message });
    }
});

router.post("/delete", async (req, res) => {
  const { id } = req.body;

  try{
    await models.deleteProduct(id);
    res.status(200).json({ success: true })
  }catch(err){
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;
