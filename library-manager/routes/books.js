var express = require('express');
var router = express.Router();

/* GET home page.*/ 
//Just rendering layout for now until I get it working
router.get('/', function(req, res, next) {
  res.render('layout.pug');
 
});

module.exports = router;