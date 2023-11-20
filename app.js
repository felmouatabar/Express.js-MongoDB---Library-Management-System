const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
const Books = require("./models/bookSchema");
const methodOverride = require("method-override");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  Books.find().then((books) => {
    res.render("index", { books });
  });
});

app.get("/book/add", (req, res) => {
  res.render("book/add");
});

app.get("/book/:bookId", (req, res) => {
  Books.findById(req.params.bookId)
    .then((result) => {
      console.log(result);
      res.render("book/bookDetails", { bookData: result });
    })
    .catch((err) => {
      console.log(err);
      res.render("404");
    });
});

app.get("/book/:bookId/edit", (req, res) => {
  Books.findById(req.params.bookId)
    .then((result) => {
      res.render("book/edit", { bookData: result });
    })
    .catch((err) => {
      console.log(err);
      res.render("404");
    });
});

app.get("/search", (req, res) => {
  const searchQuery = req.query.search_query.trim();
  console.log(searchQuery);
  Books.find({
    $or: [
      { title: { $regex: new RegExp(searchQuery, "i") } },
      { author: { $regex: new RegExp(searchQuery, "i") } },
      { publisher: { $regex: new RegExp(searchQuery, "i") } },
      { category: { $regex: new RegExp(searchQuery, "i") } },
    ],
  })
    .then((result) => {
      res.render("book/search", {
        searchData: result,
        querySearch: searchQuery,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/*", (req, res) => {
  res.render("404");
});

app.post("/book/add", (req, res) => {
  Books.create(req.body)
    .then(() => {
      res.redirect("/book/add");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/book/:bookId", (req, res) => {
  Books.findByIdAndDelete(req.params.bookId)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put("/book/:bookId/edit", (req, res) => {
  Books.findByIdAndUpdate(req.params.bookId, req.body)
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.render("book/edit", { bookData: req.body });
    });
});

mongoose
  .connect(
    "mongodb+srv://root:root@cluster0.ubluuat.mongodb.net/all-data?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
