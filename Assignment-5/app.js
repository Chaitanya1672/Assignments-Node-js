const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const exphbs = require("express-handlebars");
const mainRoutes = require("./routes/mainRoutes");

//This is for security addition
const csurf = require("csurf");

//This is for creation of session
const cookieParser = require("cookie-parser");
const seceret = "assd123^&*^&*ghghggh";
const oneDay = 1000 * 60 * 60 * 24;
const sessions = require("express-session");

app.use(
  sessions({
    secret: seceret,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

const csrfMiddleware = csurf({
  cookie: true,
});

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrfMiddleware);
app.use(express.static("uploads"));

//Environment variables which are declared in dotenv files
const PORT = process.env.PORT || 8888;
const mongoUrl = process.env.mongoUrl;

// Setting Handlebar template engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

//db Connection
mongoose
  .connect(mongoUrl)
  .then((res) => console.log("database connected"))
  .catch((err) => console.log("Error: " + err));
// db End

//User routes for all operatins
app.use("/", mainRoutes);

app.get("*", (req, res) => {
  res.render("notFound");
});

app.listen(PORT, (err) => {
  if (err) throw err;
  else console.log(`server started on ${PORT}`);
});
