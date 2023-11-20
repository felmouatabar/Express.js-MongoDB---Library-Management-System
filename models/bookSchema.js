const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const booksSchema = new Schema(
  {
    title: String,
    author: String,
    category: String,
    publisher: String,
    price: Number,
  },
  { timestamps: true }
);

const Books = mongoose.model("Book", booksSchema);

module.exports = Books;
