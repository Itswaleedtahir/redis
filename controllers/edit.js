const { SignUp } = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  edit: async (req, res) => {
    try {
      const { firstname, lastname, oldpass, newpass, } = req.body;
      const token = req.header("x-auth-token");
      const { email, id } = jwt.verify(token, process.env.jwtPrivateKey);
      // Validate

      // Check if user is available
      let user = await SignUp.findOne({ where: { email } });
      if (!user) return res.status(400).send("No such user exists.");

      const picture = req.file ? req.file.filename : user.picture;
      let hash = user.password;

      if (oldpass && newpass) {
        // Check old password
        let validPassword = await bcrypt.compare(oldpass, user.password);
        if (!validPassword) return res.status(400).send("Incorrect password.");

        // Set new password
        const salt = await bcrypt.genSalt(10);
        hash = await bcrypt.hash(newpass, salt);
      }

      let updatedUser = await SignUp.update(
        {
          firstname: firstname ? firstname : user.firstname,
          lastname: lastname ? lastname : user.lastname,
          picture:picture,
          password: oldpass && newpass ? hash : user.password,
        },
        {
          where: { email: user.email},
          returning: true,
          plain: true,
        }
      );
      const newtoken = jwt.sign(
        {
          id,
          firstname,
          lastname,
          email,
          picture,
        },
        process.env.jwtPrivateKey
      );

      return res
        .status(200)
        .send({ message: "Profile updated successfully", token: newtoken });
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .send(err.message || "Something went wrong...");
    }
  },
};
