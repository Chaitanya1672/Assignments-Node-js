const express = require("express");
const PORT = 3333;
const app = express();
const fs = require("fs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.set("view engine", "pug");
app.set("views", "./views");
// Default Route
app.get("/", (req, res) => {
  res.render("home");
});

// Contact Form Route
app.get("/contact", (req, res) => {
  res.render("contactForm");
});

// File is created and appended in Contactdata folder
app.post("/submitdata", (req, res) => {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let mobilenumber = req.body.mobnumber;

  let data = `
tr
  td ${firstname}
  td ${lastname}
  td ${email}
  td ${mobilenumber}
  `;

  if (fs.existsSync("./contactdata/details.pug")) {
    fs.appendFileSync("./contactdata/details.pug", data.toString(), "utf8");
  } else {
    fs.writeFileSync("./contactdata/details.pug", data.toString(), "utf8");
  }

  res.render("contactDetails");
});

//Basic files rendered on their specific routes
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
