const userModel = require("../model/userModel");
const tokenModel = require("../model/tokenModel");
//variable for session usage
var session;

//This are nodemailer for account activation and reseting password
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
    cb(null, path.join(__dirname, "../", "/uploads"));
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
      cb(new Error("Only png and jpg/jpeg format are allowed"));
    }
  },
});

const uploadSingle = upload.single("att");
//End of upload functionality

// Home Route
function defaultRoute(req, res) {
  session = req.session;
  if (session.username) {
    res.redirect("/dashboard");
  } else {
    return res.render("login", { csrf: req.csrfToken() });
  }
}

//Login page Route
function login(req, res) {
  let auth = req.query.msg ? true : false;
  if (auth) {
    return res.render("login", { error: "Invalid username or password" });
  } else {
    return res.render("login", { csrf: req.csrfToken });
  }
}

// After Login authentication route
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

//Route for Dashboard/Welcome page
async function dashboard(req, res) {
  let username = req.session.username;
  try {
    if (username) {
      const user = await userModel.findOne({ username: username });
      if (user) {
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

//Registration page route
function regis(req, res) {
  res.render("regis", { csrf: req.csrfToken() });
}

//Post registration route for uploading & sending mail
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
          succsMsg: `Registration Successful. \nEmail has been sent to ${user.email}`,
        });
      }
    } catch (err) {
      res.render("regis", { error: "User Already Registered" });
    }
  });
}

//Route for activating account after mail sent to user
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

// Route forlogging out user and cleaning the session storage
function logout(req, res) {
  req.session.destroy();
  return res.redirect("/login");
}

//Route for resetaccount page
function resetaccount(req, res) {
  res.render("resetaccount", { csrf: req.csrfToken() });
}

//Route for creating token and sending mail for reseting pass
async function postresetaccount(req, res) {
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

// Route for reset password page, where id & token extracted through req.query
function resetpassword(req, res) {
  res.render("resetpassword", {
    csrf: req.csrfToken(),
    id: req.query.id,
    token: req.query.token,
  });
}

//Route for changing Password & completing the reset password functionality
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
  postresetaccount,
  resetpassword,
  postresetpassword,
};
