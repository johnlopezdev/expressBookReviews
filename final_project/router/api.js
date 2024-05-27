let books = require("./booksdb.js");

function getAllBooks () {
  return new Promise((resolve, reject) => {
    if (!books) {
      reject('Error getting book information');
    } else {
      resolve(books);
    }
  })
}

function getByISBN (isbn) {
  return new Promise((resolve, reject) => {
    const book = books[isbn];

    if (!book) {
      reject(`ISBN #${isbn} not found`);
    } else {
      resolve(book);
    }
  })
}

function getByAuthor (author) {
  return new Promise((resolve, reject) => {
    const booksData = Object.values(books);
    const book = booksData.filter(book => book.author === author);

    if (!book) {
      reject(`Author ${author} not in record.`);
    } else {
      resolve(book);
    }
  })
}

function getByTitle (title) {
  return new Promise((resolve, reject) => {
    const booksData = Object.values(books);
    const book = booksData.filter(book => book.title === title);

    if (!book) {
      reject(`Title ${title} not in record.`);
    } else {
      resolve(book);
    }
  })
}

function getReviewsByISBN (isbn) {
  return new Promise(async (resolve, reject) => {
    const {reviews} = await getByISBN(isbn);

    if (!reviews) {
      reject(`No reviews found for ISBN #${isbn}`);
    } else {
      resolve(reviews);
    }
  })
}

function putReviewByISBN (payload) {
  return new Promise(async (resolve, reject) => {
    const {isbn, username, review} = payload;
    books[isbn].reviews[username] = review;

    if (!books[isbn]) {
      reject(`Unable to find book (ISBN #${isbn})`);
    } else {
      resolve(review);
    }
  })
}

module.exports = {
  getAllBooks,
  getByISBN,
  getByAuthor,
  getByTitle,
  getReviewsByISBN,
  putReviewByISBN,
}