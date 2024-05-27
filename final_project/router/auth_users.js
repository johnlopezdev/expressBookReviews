const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const { putReviewByISBN } = require('./api.js');

let users = [];

const isValid = (username) => { //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  return users.some((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  console.log(username, password)

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(401).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  const {isbn} = req.params;
  const {review} = req.body;
  const username = req.session.authorization.username;

  const payload = {
    isbn,
    username,
    review,
  }

  console.log({ payload })

  try {
    const review = await putReviewByISBN(payload);
    return res.status(200).json({message: "We appreciate your feedback!", review});
  } catch (error) {
    return res.status(400).json({message: "Failed to add review", error});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
