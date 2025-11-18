## Library App
Uses Node, Express, and Sequelize ORM with SQLite

#### Available Routes:

##### GET:
* Root - redirects to /books
* /books - displays all books
* /books/:id - displays a single book
* /books/search/ - displays books based on search term
* /books/new - displays create new book form
* /books/details/:id - displays details of a single book

##### POST:
* /books/new - adds book to db
* /books/:id - updates a single book
* /books/:id/delete - deletes a single book