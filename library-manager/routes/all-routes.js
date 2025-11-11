// const express = require('express');
// const router = express.Router();
// const {Book, Sequelize} = require('../models');
// //const {Op} = require('sequelize');

// function asyncHandler(cb) {
//     return async(req,res,next) =>{
//         try{
//             await cb(req,res,next)
//         } catch (error){
//             next(error);
//         }
//     }
// };

// router.get('/', asyncHandler(async (req, res) => {
//     res.redirect('/books');
// }));

// router.get('/books', asyncHandler(async (req,res) =>{
//     res.render('layout.pug', {books:bookList, pages, title: "Books"});
// }));

// router.get('/books/page/:id', asyncHandler(async (req, res) => {
//     res.render('index', {books: bookList, pages, title: "Books"})
// }))

// router.post('/books/search', asyncHandler(async (req,res) =>{

// }));

// router.get('/books/new', asyncHandler(async (req, res) => {
//     res.render('new-book', {book, title: "New Book" })
// }));

// router.post('/books/new', asyncHandler(async (req, res) => {
//     book= await Book.build(req.body);
// }))

// router.get('/books:id', asyncHandler(async (req, res) => {
//     res.render('update-book', {book, title: "Update Book"})
// }))

// router.post('/books/:id', asyncHandler(async (req, res) => {
//     res.render('update-book', {book, errors: error.errors})
// }))

// router.post('/books/:id/delete', asyncHandler(async(req, res) => {
//     await book.destroy();
//     res.redirect('/books');
// }))

// module.exports = router;