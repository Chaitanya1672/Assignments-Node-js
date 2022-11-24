const express = require("express");
const PORT = 3333;
const app = express();
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/contact", (req, res) => {
  res.render("contactForm");
});
app.post("/submitdata", (req, res) => {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let mobilenumber = req.body.mobnumber;

  let data = `
  <tr>
      <td>${firstname}</td>
      <td>${lastname}</td>
      <td>${email}</td>
      <td>${mobilenumber}</td>
  </tr>
  `;

  if (fs.existsSync("./contactdata/details.txt")) {
    fs.appendFileSync("./contactdata/details.txt", data.toString(), "utf8");
  } else {
    fs.writeFileSync("./contactdata/details.txt", data.toString(), "utf8");
  }

  res.render("contactDetails");
});

app.get("/data", (req, res) => {
  let data = fs.readFileSync("./contactdata/details.txt");
  res.render("contactDetails", { data: data.toString() });
});
app.get("/services", (req, res) => {
  res.render("services");
});
app.get("/about", (req, res) => {
  res.render("aboutus");
});
app.get("/gallery", (req, res) => {
  res.render("gallery");
});
app.get("*", (req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`server started on ${PORT}`);
});
