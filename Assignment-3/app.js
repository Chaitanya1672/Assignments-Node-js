const express = require("express");
require("dotenv").config();
const app = express();
const exphbs = require("express-handlebars");
const userRoutes = require("./routes/userRoutes");
const PORT = process.env.PORT || 5000;

// Setting Handlebar template engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setting Routes for User Registrations
app.use("/", userRoutes);

// Error Routes
app.get("*", (req, res) => {
  res.render("notFound");
});

app.listen(PORT, (err) => {
  if (err) throw err;
  else console.log(`server started on ${PORT}`);
});
