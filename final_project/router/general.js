const express = require("express");
// let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios").default;
const urlDataBase =
  "https://raw.githubusercontent.com/CindyRavell/expressBookReviews/refs/heads/main/final_project/router/booksdb.json";

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  if (username && password) {
    users.push({ username, password });
    return res.status(200).json({ message: "User Registered  Successfully" });
  } else {
    return res.status(400).json({
      message: "Error registering user, User name and password are required",
    });
  }
  //Write your code here
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  axios
    .get(urlDataBase)
    .then((response) => {
      res
        .status(200)
        .json({ books: response.data, message: "Completed Successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "An error occurred while fetching data" });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  axios
    .get(urlDataBase)
    .then((response) => {
      const books = response.data; // Assuming response.data is already an object
      const book = books[req.params.isbn];
      try {
        if (book) {
          return res
            .status(200)
            .send({ data: book, message: "Completed Successfully" });
        } else {
          return res.status(404).json({
            message: "Book not found",
          });
        }
      } catch (parseError) {
        return res
          .status(500)
          .json({ error: "Error parsing data from database" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "An error occurred while fetching data" });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const regex = new RegExp(req.params.author, "i");
  axios
    .get(urlDataBase)
    .then((response) => {
      const books = response.data;
      // Filter books where the author's name matches the regex
      const booksByAuthor = Object.keys(books)
        .filter((bookId) => {
          return regex.test(books[bookId].author);
        })
        .map((bookId) => books[bookId]);
      try {
        if (booksByAuthor.length > 0) {
          return res
            .status(200)
            .send({ data: booksByAuthor, message: "Completed Successfully" });
        } else {
          return res.status(404).json({
            message: "Book not found",
          });
        }
      } catch (parseError) {
        return res
          .status(500)
          .json({ error: "Error parsing data from database" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "An error occurred while fetching data" });
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const regex = new RegExp(req.params.title, "i");

  axios
    .get(urlDataBase)
    .then((response) => {
      const books = response.data;
      // Filter books where the author's name matches the regex
      const bookBytitle = Object.keys(books)
        .filter((bookId) => regex.test(books[bookId].title))
        .map((bookId) => books[bookId]);
      try {
        if (bookBytitle.length > 0) {
          return res
            .status(200)
            .send({ data: bookBytitle, message: "Completed Successfully" });
        } else {
          return res.status(404).json({
            message: "Book not found",
          });
        }
      } catch (parseError) {
        return res
          .status(500)
          .json({ error: "Error parsing data from database" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "An error occurred while fetching data" });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  return res.status(200).json({
    data: books[req.params.isbn].reviews,
    message: "Completed Successfully",
  });
});

module.exports.general = public_users;
