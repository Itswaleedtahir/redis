const { SignUp } = require("../models/index");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middleware/sendEmail");

module.exports = {
  forgot: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).send("Email is required.");

      let user = await SignUp.findOne({ where: { email: req.body.email } });
      if (!user) return res.status(400).send("No such user exists.");

      // Send email to user with reset link
      const token = jwt.sign(
        {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
        process.env.jwtPrivateKey
      );

      // const link = `http://ecowasbackend-env.eba-hvykxkzm.eu-west-1.elasticbeanstalk.com/resetPassword/${token}`; // Future work here!!!!
      const link = `http://localhost:3000/resetPassword/${token}`;

      await sendEmail(
        email,
        "wal@k2x.tech",
        `<div>
                    Click the link below to reset your password<br/>
                    <a href="${link}">Reset Password</a>
                </div>`
      );
      return res
        .status(200)
        .send({
          message:
            "Password reset link has been successfully sent to your inbox",
        });
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .send(err.message || "Something went wrong...");
    }
  },
};
