const express = require("express");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
const { registration, login } = require("../controllers/users");

router.get("/login", (req, res) => {
  res.render("login");
});

// registrarion route
router.post("/postdata", registration);

// login route
router.post("/dashboard", login);

router.get("/register", (req, res) => {
  res.render("register");
});

module.exports = router;
