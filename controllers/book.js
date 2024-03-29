const Book = require("../models/Book.js");
const fs = require("fs")

exports.getAllBooks = (req, res, next) => {
  try {
    Book.find()
      .then((books) => res.status(200).json(books))
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    res.status(500).res.json({ error });
  }
};

exports.getBookById = (req, res, next) => {
  try {
    Book.findOne({ _id: req.params.id })
      .then((book) => res.status(200).json(book))
      .catch((error) => res.status(404).json({ error }));
  } catch (error) {
    res.status(500).res.json({ error });
  }
};

exports.getBestRatingBooks = async (req, res, next) => {
  try {
    const bestBooks = await Book.find().sort({ rating: -1 }).limit(3);
    res.status(200).json(bestBooks);
  } catch (error) {
    res.status(500).res.json({ error });
  }
};

exports.createBook = (req, res, next) => {
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

    book
      .save()
      .then(() => {
        res.status(201).json({ message: "Livre créé !" });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } catch (error) {
    res.status(500).res.json({ error });
  }
};

exports.modifyBook = (req, res, next) => {
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
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        if (book.userId != req.auth.userId) {
          res.status(401).json({ message: "Not authorized" });
        } else {
          Book.updateOne(
            { _id: req.params.id },
            { ...bookObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Livre modifié!" }))
            .catch((error) => res.status(401).json({ error }));
        }
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteBook = (req, res, next) => {
  try {
    Book.findOne({ _id: req.params.id }).then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    });
  } catch (error) {
    res.status(500).res.json({ error });
  }
};
