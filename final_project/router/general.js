const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios").default;
const urlDataBase =
  "https://raw.githubusercontent.com/ibm-developer-skills-network/lkpho-Cloud-applications-with-Node.js-and-React/master/CD220Labs/async_callback/sampleData.jsonhttps://reststop.randomhouse.com/resources/works/?expandLevel=1&search=Grisham";

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

public_users.get("/books", function (req, res) {
  return res
    .status(200)
    .json({ data: books, message: "Completed Successfully" })
    .catch((err) => {
      return res.status(404).json({ message: "Error fetching book list", err });
    });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const promise = new Promise((resolve, reject) => {
    // setTimeout(() => resolve(books), 600);
    axios.get(urlDataBase).then((response) => {
      resolve(response.data);
    });
  });

  promise.then((result) => {
    return res.status(200).json({ books: result });
  });

  // request
  //   .then((data) => {
  //     return res.status(200).json({
  //       data: data,
  //       message: "Completed Successfully",
  //     });
  //   })
  //   .catch((err) => {
  //     return res.status(404).json({ message: "Error fetching book list", err });
  //   });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    return res
      .status(200)
      .json({ data: book, message: "Completed Successfully" });
  } else {
    return res.status(404).json({
      message: "Book not found",
    });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const regex = new RegExp(req.params.author, "i");

  // Filter books where the author's name matches the regex
  const booksByAuthor = Object.keys(books)
    .filter((bookId) => {
      return regex.test(books[bookId].author);
    })
    .map((bookId) => books[bookId]);

  return res
    .status(200)
    .json({ data: booksByAuthor, message: "Completed Successfully" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const regex = new RegExp(req.params.title, "i");
  const bookBytitle = Object.keys(books)
    .filter((bookId) => regex.test(books[bookId].title))
    .map((bookId) => books[bookId]);

  return res
    .status(200)
    .json({ data: bookBytitle, message: "Completed Successfully" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  return res.status(200).json({
    data: books[req.params.isbn].reviews,
    message: "Completed Successfully",
  });
});

module.exports.general = public_users;
