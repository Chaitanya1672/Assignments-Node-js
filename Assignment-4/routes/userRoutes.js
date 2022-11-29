const express = require("express");
const proModel = require("../model/product");
const {
  SaveProduct,
  getProductById,
  getAllProduct,
  deleteProduct,
  updateProduct,
  updateWithId,
} = require("../controllers/productsController");

// express router declared
const router = express.Router();
router.get("/", (req, res) => {
  res.render("home");
});

//All the routes and controllers
router.get("/updateForm/:id", updateWithId);
router.post("/addproduct", SaveProduct);
router.get("/getproductbyid/:id", getProductById);
router.post("/deleteproduct/:id", deleteProduct);
router.get("/getproducts", getAllProduct);
router.post("/editproduct/:id", updateProduct);

module.exports = router;
