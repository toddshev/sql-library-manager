var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/books/new', function(req, res, next) {
  res.render('new-book');
 
});

module.exports = router;
