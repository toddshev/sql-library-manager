var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

//Do I also need to require models/book.js?
const Sequelize = require('./models/index.js').sequelize;
//const routes = require('./routes/');
//Above comment is because I'm trying to combine all routes into 1 file.

//Connection is typically good
(async () => {
  try {
    await Sequelize.sync();
    await Sequelize.authenticate();
    console.log('Connection lovely');
  } catch (error){
    console.error('Error connecting', error);
  }
})();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Kept getting an error when using all routes

//app.use(routes);
 app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/books/new', newBookRouter);
 app.use('/books', booksRouter);
// app.use('/index', detailRouter); 


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('This page cannot be found');
  err.status = 404;
  err.message = 'We are sorry, we could not find what you are looking for';
  res.render('page-not-found', {err});
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  err.message = 'We are sorry, you have encountered an error';
  console.log(`Error: ${err.status} : ${err.message}`);
  res.render('error', {err});
});

module.exports = app;