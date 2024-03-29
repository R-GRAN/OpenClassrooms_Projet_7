const Book = require("../models/Book.js");
const path = require("path");
const fs = require("fs").promises;

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (book) res.status(200).json(book);
    else res.status(404).json({ message: "Book not found" });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getBestRatingBooks = async (req, res) => {
  try {
    const bestBooks = await Book.find().sort({ rating: -1 }).limit(3);
    res.status(200).json(bestBooks);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createBook = async (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });

    await book.save();
    res.status(201).json({ message: "Book created" });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createRatingBook = async (req, res) => {
  try {
    const id = req.params.id;

    const rating = req.body.rating;
    const userId = req.auth.userId;

    const book = await Book.findOne({ _id: id });

    if (!book) return res.status(404).json("Book not found");

    const ratings = book.ratings;
    const haveAlreadyRate = ratings.find((rating) => rating.userId === userId);
    if (haveAlreadyRate != null) {
      return res.status(400).json("You have already voted for this book");
    }

    const newRating = { userId: userId, grade: rating };

    ratings.push(newRating);

    book.averageRating = averageRating(ratings);

    function averageRating(ratings) {
      const sumOfAllRating = ratings.reduce(
        (sum, rating) => sum + rating.grade,
        0
      );
      const average = sumOfAllRating / ratings.length;
      return Math.round(average);
    }

    const updatedBook = await book.save();

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.modifyBook = async (req, res) => {
  try {
    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

    delete bookObject._userId;
    const book = await Book.findOne({ _id: req.params.id });

    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.userId != req.auth.userId)
      return res.status(403).json({ message: "unauthorized request" });

    const oldImagePath = path.join(
      __dirname,
      "..",
      "images",
      book.imageUrl.split("/").pop()
    );

    const updatedBook = await Book.updateOne(
      { _id: req.params.id },
      { ...bookObject, _id: req.params.id }
    );

    if (updatedBook && req.file) {
      if (oldImagePath != null) await fs.unlink(oldImagePath);
      res.status(200).json({ message: "Book modified" });
    } else if (updatedBook) {
      res.status(200).json({ message: "Book modified" });
    } else {
      res.status(400).json({ error: "Error during modification" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.userId != req.auth.userId)
      return res.status(403).json({ message: "unauthorized request" });

    const filename = book.imageUrl.split("/images/")[1];

    fs.unlink(`images/${filename}`, () => {
      Book.deleteOne({ _id: req.params.id }).then(() => {
        res.status(200).json({ message: "Book deleted" });
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
