const fs = require("fs");

//Registration controller
const registration = (req, res) => {
  let { fname, lname, email, password, age, msgBx } = req.body;

  if (fs.existsSync(`./users/${email}.txt`)) {
    res.render("login", { succsMsg: "User already exists" });
  } else {
    fs.writeFile(
      `./users/${email}.txt`,
      `${fname}\n${lname}\n${email}\n${password}\n${age}\n${msgBx}`,
      (err) => {
        if (err) {
          res.render("regisSuccess", { errMsg: "something went wrong" });
        } else {
          res.render("regisSuccess", { succsMsg: "Registered succesfully" });
        }
      }
    );
  }
};

// Login Controller
const login = (req, res) => {
  let { email, password } = req.body;
  if (fs.existsSync(`./users/${email}.txt`)) {
    const data = fs.readFileSync(`./users/${email}.txt`);
    let dataArr = data.toString().split("\n");

    if (dataArr[3] === password) {
      res.render("dashboard", {
        succsMsg: `${dataArr[0]} ${dataArr[1]}`,
        dataArr,
      });
    } else {
      res.render("login", { errMsg: `Password for ${email} is wrong` });
    }
  } else {
    res.render("register", { errMsg: "User not found" });
  }
};

module.exports = { registration, login };
