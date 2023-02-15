const { SignUp } = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

module.exports = {
  //signUp API................................................................
  signUp: async (req, res) => {
    try {
      const { firstname, lastname, email, password } = req.body;
      if (!firstname || !lastname || !email || !password) {
        throw { status: 400, message: "Required fields cannot be empty." };
      }
      const emailfound = await SignUp.findOne({
        where: {
          email: email,
        },
      });
      if (emailfound) {
        throw { status: 409, message: "email already exists." };
      }

      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);
      console.log(hashedpassword);
      let user = await SignUp.create({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedpassword,
      });
      const token = jwt.sign(
        {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
        process.env.jwtPrivateKey
      );
      await user.save();
      res
        .header("x-auth-token", token)
        .send(_.pick(user, ["email", "firstname", "lastname", "password"]));
    } catch (err) {
      return res
        .status(err.status || 500)
        .send(err.message || "Something went wrong...");
    }
  },
  //logIn API................................................................
  logIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw { status: 400, message: "Required fields cannot be empty." };
      }
      const user = await SignUp.findOne({
        where: {
          email: email,
        },
      });
      console.log(password);
      if (!user) {
        throw { status: 409, message: "Invalid email " };
      }

      let validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword)
        return res.status(400).send("Invalid email or password.");
      const token = jwt.sign(
        {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          picture:user.picture
        },
        process.env.jwtPrivateKey
      );
      res.send(token);
    } catch (err) {
      return res
        .status(err.status || 500)
        .send(err.message || "Something went wrong...");
    }
  },
};
