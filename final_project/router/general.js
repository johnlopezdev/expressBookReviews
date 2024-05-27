const express = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const {
  getAllBooks,
  getByISBN,
  getByAuthor,
  getByTitle,
  getReviewsByISBN,
} = require('./api.js');

public_users.post("/register", (req, res) => {
  const {username, password} = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(409).json({message: "User already exists!"});
    }
  }

  return res.status(400).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    return res.status(400).json({message: "No books available"})
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const {isbn} = req.params;

  try {
    const book = await getByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(400).json({message: "Book not found", error})
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const {author} = req.params;

  try {
    const book = await getByAuthor(author);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(400).json({message: "Book not found", error})
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const {title} = req.params;

  try {
    const book = await getByTitle(title);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(400).json({message: "Book not found", error})
  }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const {isbn} = req.params;

  try {
    const review = await getReviewsByISBN(isbn);
    return res.status(200).json(review);
  } catch (error) {
    return res.status(400).json({message: "Review not found", error})
  }
});

module.exports.general = public_users;
