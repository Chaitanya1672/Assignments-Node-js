const userModel = require("../model/userModel");
const tokenModel = require("../model/tokenModel");

var session;

//This is the variable for sending mail whose functionality in nodemailer.js
const { mailSender, resetMailSender } = require("../nodemailer");

//This is used for file uploading
const path = require("path");
const multer = require("multer");

//This is for security addition
const bcrypt = require("bcrypt");
const saltRounds = 10;
const crypto = require("crypto");

//This for File uploading functionality
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(
        "D:/Node Js Practice/Training nodeJs/Assignments/Assignment-5",
        "/uploads"
      )
    );
  },
  filename: function (req, file, cb) {
    fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + fileExtension);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error("Only png and jpg formet allowed"));
    }
  },
});
//end upload functionality

function defaultRoute(req, res) {
  console.log(req.session);
  session = req.session;
  if (session.username) {
    res.redirect("/dashboard");
  } else {
    return res.render("login", { csrf: req.csrfToken() });
  }
}
function login(req, res) {
  let auth = req.query.msg ? true : false;
  if (auth) {
    return res.render("login", { error: "Invalid username or password" });
  } else {
    return res.render("login", { csrf: req.csrfToken });
  }
}
async function postlogin(req, res) {
  let { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username: username });
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        session = req.session;
        session.username = username;
        return res.redirect("/dashboard");
      } else {
        return res.redirect("/login?msg=fail");
      }
    } else {
      return res.redirect("/login?msg=fail");
    }
  } catch (error) {
    return res.redirect("/login?msg=fail");
  }
}
async function dashboard(req, res) {
  let username = req.session.username;
  try {
    if (username) {
      const user = await userModel.findOne({ username: username });
      if (user) {
        console.log(user);
        return res.render("dashboard", {
          uname: user.username,
          path: user.image,
        });
      } else {
        res.send("User not found");
      }
    } else {
      return res.redirect("/login");
    }
  } catch (error) {
    res.send("something went wrong in dashboard func");
  }
}
function regis(req, res) {
  res.render("regis", { csrf: req.csrfToken() });
}

const uploadSingle = upload.single("att");
async function postregis(req, res) {
  uploadSingle(req, res, async (err) => {
    try {
      if (err) {
        res.render("regis", { error: err.message });
      } else {
        let { email, username, password } = req.body;
        const hash = bcrypt.hashSync(password, saltRounds);
        const user = await userModel.create({
          email: email,
          username: username,
          password: hash,
          image: req.file.filename,
        });
        mailSender(user);
        res.render("regis", {
          succsMsg: `Registration Successful. Email has been sent to ${user.email}`,
        });
      }
    } catch (err) {
      res.render("regis", { error: "User Already Registered" });
    }
  });
}
async function activateaccount(req, res) {
  let id = req.params.id;
  try {
    const user = await userModel.findOne({ _id: id });
    if (user) {
      //const updatedUser
      await userModel.updateOne({ _id: id }, { $set: { status: 1 } });
      res.render("activate", { username: user.username });
    } else {
      res.send("Some Thing Went Wrong");
    }
  } catch (error) {
    res.send("Some Thing Went Wrong1");
  }
}
function logout(req, res) {
  req.session.destroy();
  return res.redirect("/login");
}
function resetaccount(req, res) {
  res.render("resetaccount", { csrf: req.csrfToken() });
}
async function postaccountreset(req, res) {
  let email = req.body.email;
  try {
    let user = await userModel.findOne({ email: email });
    if (user) {
      let token = await tokenModel.findOne({ userId: user._id });
      if (token) await tokenModel.deleteOne();
      let restToken = crypto.randomBytes(32).toString("hex");
      const hash = await bcrypt.hash(restToken, Number(saltRounds));
      const newToken = await tokenModel.create({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
      });
      resetMailSender(newToken, restToken, email);
      return res.render("resetaccount", {
        succMsg: "Reset link sent to your Email",
      });
    } else {
      return res.render("resetaccount", { errMsg: "Email does not exists" });
    }
  } catch (error) {
    res.render("resetaccount", { errMsg: error });
  }
}

function resetpassword(req, res) {
  console.log(req.query.id);
  res.render("resetpassword", {
    csrf: req.csrfToken(),
    id: req.query.id,
    token: req.query.token,
  });
}
async function postresetpassword(req, res) {
  let { id, token, password } = req.body;
  console.log(req.body);
  try {
    let passToken = await tokenModel.findOne({ userId: id });
    if (!passToken) {
      return res.render("resetpassword", { errMsg: "Pass : Token Expire" });
    }
    const isValid = await bcrypt.compare(token, passToken.token);
    if (!isValid) {
      return res.render("resetpassword", { errMsg: "Pass 1 :Token Expire" });
    }
    const hash = await bcrypt.hash(password, Number(saltRounds));
    await userModel.updateOne(
      {
        _id: id,
      },
      { $set: { password: hash } },
      { new: true }
    );
    return res.render("resetpassword", {
      succMsg: "Password Changed Successfully",
    });
  } catch (error) {
    res.render("resetpassword", { errMsg: error });
  }
}

module.exports = {
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
};
