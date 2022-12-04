const nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");

//attach the plugin to the nodemailer transporter

//This nodemailer is for activate account functionality
const mailSender = (data) => {
  let { email, _id, username } = data;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: "chetannarhare111@gmail.com",
      pass: "qmslvtfedeuqando",
    },
  });
  transporter.use(
    "compile",
    hbs({
      viewEngine: "nodemailer-express-handlebars",
      viewPath: "views/emailTemplates/",
    })
  );
  let mailOptions = {
    from: "chetannarhare111@gmail.com",
    to: email,
    subject: "Account Activation",
    template: "mail",
    context: {
      username: username,
      id: _id,
    },
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Mail send : " + info);
    }
  });
};

//This nodemailer is for reset password functionality
const resetMailSender = (newToken, restToken, email) => {
  let { userId, username } = newToken;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: "chetannarhare111@gmail.com",
      pass: "qmslvtfedeuqando",
    },
  });
  transporter.use(
    "compile",
    hbs({
      viewEngine: "nodemailer-express-handlebars",
      viewPath: "views/emailTemplates/",
    })
  );
  let mailOptions = {
    from: "chetannarhare111@gmail.com",
    to: email,
    subject: "Reset Password Link",
    template: "resetpasstemp",
    context: {
      token: restToken,
      id: userId,
      username: username,
    },
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      return res.render("resetaccount", {
        succMsg: "Reset Link sent to your E-mail",
      });
    }
  });
};

module.exports = { mailSender, resetMailSender };
