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

//Landing page, re-directs to show book list
router.get('/', asyncHandler(async (req, res) => {
    res.redirect('/books/');
}));

//List of all books - no pagination at the moment
router.get('/books', asyncHandler(async (req,res) =>{
     let activePage = 1;  //defaults to page 1
     const page = Number.parseInt(req.query.page);
     if (page){
         activePage = page;  //if page is received via qstring, update activePage
     }
   
     const booksPerPage = 10;
     let bookOffset = (activePage-1) * booksPerPage; //adjust offset based on page num clicked
     const numBooks = await Book.count(); //get count to determine num to display if last page
    
    let booksToRender;
    if (numBooks < (activePage * booksPerPage)){
        booksToRender = numBooks - (activePage-1 * booksPerPage );
    } else {
        booksToRender = booksPerPage;
    }

    const {count, rows} = await Book.findAndCountAll({
        limit:booksToRender,
        offset:bookOffset,
    });
        
    //Math/logic to calc for pagination
    const pageArray = [];
    const pages = Math.ceil(count / booksPerPage);

    //Creates an array of pages to send to pug to add pagination to the bottom
    for (i=0; i<pages; i++){
        pageArray.push(i);
    }        
   
    const books = rows;
    res.render('index', {books, title: "Books", pageArray});
}));

//Display books based on search results
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

    res.render('index', {
        books,
        title: 'Books',
        search,
    });
}));

//Renders the new-book form
router.get('/books/new', asyncHandler(async (req, res) => {
    res.render('new-book', {title: "New Book" });
}));

//Adds book to library upon form submission
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
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const book = await Book.findByPk(id);
    
    await book.destroy();
    res.redirect('/books');      
}));

module.exports = router;