const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.find((user) => user.username === username)) {
      return res.status(401).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//     res.send(JSON.stringify(books,null,4));
// });

public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject(new Error("Error fetching books"));
        }
    })
    .then(books => {
        res.json(books);
    })
    .catch(error => {
        res.status(500).json({message: error.message});
    });
});

// public_users.get('/isbn/:isbn', function (req, res) {
//     const isbn = parseInt(req.params.isbn);
//     const book = books[isbn]

//     if (book) {
//         res.json(book); 
//     } else {
//         res.status(404).json({message: "Book not found"}); 
//     }
// });

public_users.get('/isbn/:isbn', function (req, res) {
    new Promise((resolve, reject) => {
        const isbn = parseInt(req.params.isbn);
        const book = books[isbn];

        if (book) {
            resolve(book);
        } else {
            reject(new Error("Book not found"));
        }
    })
    .then(book => {
        res.json(book);
    })
    .catch(error => {
        res.status(404).json({message: error.message});
    });
});


// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     const author = req.params.author.toLowerCase(); 
//     let booksByAuthor = []; 

//     for (let key in books) {
//         if (books[key].author.toLowerCase() === author) {
//             booksByAuthor.push(books[key]);
//         }
//     }
//     if (booksByAuthor.length > 0) {
//         res.json(booksByAuthor); 
//     } else {
//         res.status(404).json({message: "Books by this author not found"}); 
//     }
// });


public_users.get('/author/:author', function (req, res) {
    new Promise((resolve, reject) => {
        const author = req.params.author.toLowerCase(); 
        let booksByAuthor = []; 

        for (let key in books) {
            if (books[key].author.toLowerCase() === author) {
                booksByAuthor.push(books[key]);
            }
        }

        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject(new Error("Books by this author not found"));
        }
    })
    .then(booksByAuthor => {
        res.json(booksByAuthor);
    })
    .catch(error => {
        res.status(404).json({message: error.message});
    });
});

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     const title = req.params.title.toLowerCase(); 
//     let booksByTitle = []; 

//     for (let key in books) {
//         if (books[key].title.toLowerCase() === title) {
//             booksByTitle.push(books[key]); 
//         }
//     }

//     if (booksByTitle.length > 0) {
//         res.json(booksByTitle); 
//     } else {
//         res.status(404).json({message: "Books with this title not found"}); 
//     }
// });

public_users.get('/title/:title', function (req, res) {
    new Promise((resolve, reject) => {
        const title = req.params.title.toLowerCase(); 
        let booksByTitle = []; 

        for (let key in books) {
            if (books[key].title.toLowerCase() === title) {
                booksByTitle.push(books[key]);
            }
        }

        if (booksByTitle.length > 0) {
            resolve(booksByTitle); 
        } else {
            reject(new Error("Books with this title not found"));
        }
    })
    .then(booksByTitle => {
        res.json(booksByTitle);
    })
    .catch(error => {
        res.status(404).json({message: error.message});
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn, 10);
    const book = books[isbn]; 

    if (book && book.reviews) {
        res.json(book.reviews); 
    } else {
        res.status(404).json({message: "Reviews not found for this book"});
    }
});
module.exports.general = public_users;
