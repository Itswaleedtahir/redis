const { URLSearchParams } = require("url");
const jwt = require("jsonwebtoken");
const { SignUp } = require("../models/index");
const axios = require("axios");
const fetch = require("node-fetch");

const fetchJSON = (...args) => fetch(...args).then((r) => r.json());

const LINKEDIN_TOKEN = `https://www.linkedin.com/oauth/v2/accessToken`;
const LINKEDIN_NAME = "https://api.linkedin.com/v2/me";
const LINKEDIN_EMAIL =
  "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))";
LINKEDIN_CLIENT_ID = "77naq21zofxobx";
LINKEDIN_CLIENT_SECRET = "sbi2Qv4PaeG8amYi";
redirectUri =
  "http://vimentobackend-env.eba-dmebp3sv.eu-west-1.elasticbeanstalk.com/linkedin";
module.exports = {
  getValidatedWithLinkedinUser: async (req, res) => {
    try {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: req.body.code,
        redirect_uri: redirectUri,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: LINKEDIN_CLIENT_SECRET,
      });
      const { access_token } = await fetchJSON(LINKEDIN_TOKEN, {
        method: "POST",
        body,
      });
      const payload = {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      };
      const { localizedFirstName, localizedLastName, id } = await fetchJSON(
        LINKEDIN_NAME,
        payload
      );
      const userData = {
        firstname: `${localizedFirstName}`,
        lastname: `${localizedLastName}`,
      };
      const response = await fetchJSON(LINKEDIN_EMAIL, payload);
      if (response.elements) {
        userData.email = response.elements[0]["handle~"].emailAddress;
        userData.id = id;
      }
      console.log(userData);

      let user = await SignUp.findOne({
        where: { linkedInid: userData.id },
      });
      if (user) {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
          },
          process.env.jwtPrivateKey
        );
        return res.send(token);
      } else {
        const checkuser = await SignUp.findOne({
          where: { email: userData.email },
        });
        if (checkuser) {
          const updatedRows = await SignUp.update(
            {
              linkedInid: userData.id,
            },
            {
              where: { id: Number(checkuser.dataValues.id) },
            }
          );

          const token = jwt.sign(
            {
              id: checkuser.dataValues.id,
              email: checkuser.dataValues.email,
              firstname: checkuser.dataValues.firstname,
              lastname: checkuser.dataValues.lastname,
            },
            process.env.jwtPrivateKey
          );
          return res.send(token);
        } else {
          const newUser = {
            linkedInId: userData.id,
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
          };
          const user1 = await SignUp.create(newUser);
          const token = jwt.sign(
            {
              id: user1.id,
              email: user1.email,
              firstname: user1.firstname,
              lastname: user1.lastname,
            },
            process.env.jwtPrivateKey
          );
          return res.send(token);
        }
      }
    } catch (err) {
      console.log(err);
      return res
        .status(err.status || 500)
        .send(err.message || "Something went wrong...");
    }
  },
};
