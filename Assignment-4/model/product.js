//Schema for data storing and transfer
const mongoose = require("mongoose");
const proSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  imgUrl: { type: String, required: true },
});
module.exports = mongoose.model("product", proSchema);
