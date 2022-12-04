// express router declared
const express = require("express");
const router = express.Router();

const {
  defaultRoute,
  login,
  postlogin,
  dashboard,
  regis,
  postregis,
  activateaccount,
  logout,
  resetaccount,
  postaccountreset,
  resetpassword,
  postresetpassword,
} = require("../controllers/user");

router.get("/", defaultRoute);

router.get("/login", login);

router.post("/postlogin", postlogin);

router.get("/dashboard", dashboard);

router.get("/regis", regis);

router.post("/postregis", postregis);

router.get("/activateaccount/:id", activateaccount);

router.get("/logout", logout);
router.get("/resetaccount", resetaccount);

router.post("/postaccountreset", postaccountreset);
router.get("/resetpassword", resetpassword);
router.post("/postresetpassword", postresetpassword);

module.exports = router;
