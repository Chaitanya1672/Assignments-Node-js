const express = require("express");
const PORT = 3333;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("*", (req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`server started on ${PORT}`);
});
