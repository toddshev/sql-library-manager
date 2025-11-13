const express = require('express');
const router = express.Router();
const {Book} = require('../models');
//const {Op} = require('sequelize');
const rl = require('node:readline/promises');

function asyncHandler(cb) {
  return async(req,res,next) =>{
        try{
            await cb(req,res,next)
        } catch (error){
            next(error);
        }
    }
};

//Landing page, re-directs to show book list
//Status: Good
router.get('/', asyncHandler(async (req, res) => {
    res.redirect('/books');
}));

//List of all books - no pagination at the moment
//Status: Good
router.get('/books', asyncHandler(async (req,res) =>{
    const books = await Book.findAll();
    res.render('index', {books, title: "Books"});
}));

//Renders the new-book form
//Status: Good
router.get('/books/new', asyncHandler(async (req, res) => {
    res.render('new-book', {title: "New Book" });
}));

//Adds book to library upon form submission
//Status: 
router.post('/books/new', asyncHandler(async (req, res, next) => {
    let book;
    try{
        book = await Book.create(req.body);
        res.redirect("/books");
    }catch (error){
        if (error.name === 'SequelizeValidationError'){
            book = await Book.build(req.body);
            res.render('new-book', {
                book,
                errors: error.errors,
                title: "New Book",
            });
        }else{
            throw error;
        }
    }

}));

//Book details
//Status: 
router.get('/books/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const book = await Book.findByPk(id);
    if (book){
        res.render('update-book', {book, title: book.title})
    }else {
        const err = new Error("Can not find book");
        err.status = 404;
        throw err;
    }

}));
 
//Update Book
//Status: Good 
router.post('/books/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const book = await Book.findByPk(id);
    try{
        await book.update(req.body);
        res.redirect('/books');
    } catch (error){
        if (error.name === 'SequelizeValidationError'){
            res.render('update-book', {
                book,
                errors: error.errors,
                title: 'Update Book- fix errors'
            });
        }else {
            throw error;
        }
    }
}))

//Delete book
//Status: 
router.post('/books/:id/delete', asyncHandler(async(req, res) => {
    const id = req.params.id;
    const book = await Book.findByPk(id);
    
    await book.destroy();
    res.redirect('/books');      
}));

//For later.................
// router.get('/books/page/:id', asyncHandler(async (req, res) => {
//     res.render('index', {books: bookList, pages, title: "Books"})
// }))

//router.post('/books/search', asyncHandler(async (req,res) =>{

//}));


module.exports = router;
