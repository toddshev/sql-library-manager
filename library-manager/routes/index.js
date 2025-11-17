const express = require('express');
const router = express.Router();
const {Book} = require('../models');
const {Op} = require('sequelize');

function asyncHandler(cb) {
  return async(req,res,next) =>{
        try{
            await cb(req,res,next)
        } catch (error){
            next(error);
        }
    }
};

function getBooks(page){
    
}
//Landing page, re-directs to show book list
//Status: Good
router.get('/', asyncHandler(async (req, res) => {
    res.redirect('/books/');
}));

//List of all books - no pagination at the moment
//Status: Good
router.get('/books', asyncHandler(async (req,res) =>{
    const {count, rows} = await Book.findAndCountAll();
    let activePage = 1;

    //Math/logic to calc for pagination
    const booksPerPage = 10;
    const numPages = Math.ceil(count / booksPerPage)
    const pageArray = [];
    //Creates an array of pages to send to pug to add pagination to the bottom
    for (i=0; i<numPages; i++){
        pageArray.push(i);
    }    
    const totalBooks = rows;
    const firstBook = (activePage * booksPerPage - booksPerPage);
    let lastBook;
    if (totalBooks.length < (activePage *booksPerPage -1)){
        lastBook = totalBooks.length -1;
    }else {
        lastBook = (activePage * booksPerPage - 1);
    }
    
    let books = [];

    for (let i = firstBook; i<= lastBook; i++){
       books.push(totalBooks[i]);
    }

    res.render('index', {books, title: "Books", pageArray});
}));

//Display books based on search results
//Status: Working okay, but pagination broke it briefly
router.get('/books/search', asyncHandler(async (req, res) =>{
    const {search} = req.query;
    const books = await Book.findAll({
        where: {
            [Op.or]: [
                {title: { [Op.like]: `%${search}%`} },
                {author: { [Op.like]: `%${search}%`}},
                {genre: { [Op.like]: `%${search}%`}},
                {year: { [Op.like]: `%${search}%`}},
            ],
        },
    });
    //Books are fetching correctly, only display is broken

    res.render('index', {
        books,
        title: 'Books',
        search,
    });
}));

router.get('/books/page/:page', asyncHandler(async (req, res) => {
    const {count, rows} = await Book.findAndCountAll();
    let activePage = req.params.page;
  
    //Math/logic to calc for pagination
    const booksPerPage = 10;
    const numPages = Math.ceil(count / booksPerPage)
    const pageArray = [];
    //Creates an array of pages to send to pug to add pagination to the bottom
    for (i=0; i<numPages; i++){
        pageArray.push(i);
    }    
    const totalBooks = rows;
    const firstBook = (activePage * booksPerPage - booksPerPage);
    let lastBook;
    if (totalBooks.length < (activePage *booksPerPage -1)){
        lastBook = totalBooks.length -1;
    }else {
        lastBook = (activePage * booksPerPage - 1);
    }

    let books = [];

    for (let i = firstBook; i<= lastBook; i++){
       books.push(totalBooks[i]);
    }

    res.render('index', {
        books, 
        title: "Books",
        pageArray
    });
}));

//Renders the new-book form
//Status: Good
router.get('/books/new', asyncHandler(async (req, res) => {
    res.render('new-book', {title: "New Book" });
}));

//Adds book to library upon form submission
//Status: Good
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
//Status: Good 
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
//Status: Good 
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const book = await Book.findByPk(id);
    
    await book.destroy();
    res.redirect('/books');      
}));

module.exports = router;