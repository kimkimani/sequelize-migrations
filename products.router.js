const express = require("express");
const router = express.Router();
const ProductsRepo = require("./products.repo");


router.get("/products", async (req, res) => {
  try {
    var productsList = await ProductsRepo.GetProducts();
    return res.send(productsList);
  } catch (err) {
    console.log(err);
  }
});

router.post("/products", async (req, res) => {
  try {
    console.log(req.body);
    if (req.body) {
      const { name, price, inventory } = req.body;
      console.log(req.body);
      const ProductsData = await ProductsRepo.AddProduct({
        name,
        price,
        inventory,
      });
      res.send({ message: "data added !!", ProductsData });
    } else {
      console.log("no body found");
      res.send({ message: "body not found or available" });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;