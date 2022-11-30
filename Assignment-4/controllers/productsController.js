const productModel = require("../model/product");

//controller for adding/create the product
function SaveProduct(req, res) {
  const bodyData = req.body;
  let ins = new productModel(bodyData);
  ins.save((err) => {
    if (err) res.send("Something went wrong or Already exists");
    else {
      res.redirect("/getproducts");
      // res.send("Product Add Successfully")
    }
  });
}

//controller for reading/getting the product
async function getProductById(req, res) {
  let proId = req.params.id;
  let product = await productModel.findById(proId);
  if (!product) {
    res.status(404).send("Product with id not found");
  }
  res.send(product);
}

//controller for reading/getting all products
function getAllProduct(req, res) {
  productModel.find({}, (err, data) => {
    if (err) {
      res.send("Something went wrong");
    } else {
      res.render("card", { productData: data });
      // console.log(data);
    }
  });
}

// controller for deleting the product
function deleteProduct(req, res) {
  let pid = req.params.id;
  productModel.deleteOne({ _id: pid }, (err) => {
    if (err) {
      res.send("Something wrong");
    } else {
      res.status(200).redirect("/getproducts");
    }
  });
}

//controller for updating/editting the product
function updateWithId(req, res) {
  let pid = req.params.id;
  productModel.findById(pid, (err, data) => {
    if (err) {
      res.send("Something went wrong");
    } else {
      res.render("updateProduct", { _id: pid, data: data.toJSON() });
    }
  });
}

function updateProduct(req, res) {
  let pid = req.params.id;
  let formData = req.body;
  productModel.updateOne({ _id: pid }, { $set: formData }, (err) => {
    if (err) {
      console.log("Error");
    } else {
      res.redirect("/getproducts");
    }
  });
}

module.exports = {
  SaveProduct,
  getProductById,
  getAllProduct,
  deleteProduct,
  updateProduct,
  updateWithId,
};
