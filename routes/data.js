const { Router } = require("express");
const router = Router();
const auth = require('../middleware/auth')
const cache = require('../middleware/cache.JS')
const data = require('../controllers/search.js');

router.post('/companydata',cache, data.data);
router.get('/initialdata', data.initialdata);
router.get('/dropdown1',  data.Type);
router.get('/dropdown2', data.Industry);
router.get('/dropdown3', data.IntervalEmployee);
router.get('/dropdown4', data.Region);
router.get('/dropdown5', data.Muncipality);
module.exports = router;
