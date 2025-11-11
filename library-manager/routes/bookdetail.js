var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/books/:id', function(req, res, next) {
  res.render('update-book', {id});
 
});

module.exports = router;
