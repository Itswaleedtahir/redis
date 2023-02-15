const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const web = require('../controllers/user.js');
const google = require('../controllers/google.js');
const forgot = require('../controllers/forgot');
const reset = require('../controllers/reset');
const edit = require('../controllers/edit');
const linkedin = require("../controllers/linkedin.js");
const auth = require('../middleware/auth')
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, next) {
      next(null, "public/profile");
    },
    filename: function (req, file, next) {
      let token = req.header("x-auth-token");
      let { id } = jwt.verify(token, process.env.jwtPrivateKey);
  
      next(null, "User" + id + ".png");
    },
  });
  const profile = multer({ storage });

router.post('/signup', web.signUp);
router.post('/login', web.logIn);
router.post('/forgot',forgot.forgot );
router.post('/google', google.google);
router.put('/edit', profile.single("picture"),auth, edit.edit);
router.post('/linkedin', linkedin.getValidatedWithLinkedinUser);
router.put('/reset/:token',reset.reset );

module.exports = router;