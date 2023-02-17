const { Router } = require("express");
const router = Router();
const auth = require('../middleware/auth')
const cache = require('../middleware/cache.js')
const dropdowns = require('../middleware/dropdowns')
const initialdata = require('../middleware/initialdata')
const data = require('../controllers/search.js');

router.post('/companydata',cache,auth ,data.data);
router.get('/initialdata',initialdata ,data.initialdata);
router.get('/dropdown1',dropdowns.dropdown1 , data.Type);
router.get('/dropdown2',dropdowns.dropdown2, data.Industry);
router.get('/dropdown3',dropdowns.dropdown3,data.IntervalEmployee);
router.get('/dropdown4',dropdowns.dropdown4 ,data.Region);
router.get('/dropdown5',dropdowns.dropdown5, data.Muncipality);
module.exports = router;
