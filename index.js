// Import express and ejs
var express = require('express');
var ejs = require('ejs');

// Import mysql module
var mysql = require('mysql2');

//Import the express-session module
var session = require ('express-session');

//Import the express-validator module
var validator = require ('express-validator');

//Import the express-sanitizer module
const expressSanitizer = require('express-sanitizer');

// Create the express application object
const app = express();
const port = 8000;

// Create an input sanitizer
app.use(expressSanitizer());

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Set up the body parser 
app.use(express.urlencoded({ extended: true }));

// Set up the express-session
// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// Set up public folder (for css and static js)
app.use(express.static(__dirname + '/public'));

// Define the database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'bettys_books_app',
    password: 'qwertyuiop',
    database: 'bettys_books'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// Define our application-specific data
app.locals.shopData = { shopName: "Bettys Books" };

// Load the route handlers
const mainRoutes = require("./routes/main");
app.use('/', mainRoutes);

// Load the route handlers for /users
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

// Load the route handlers for /books
const booksRoutes = require('./routes/books');
app.use('/books', booksRoutes);

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
