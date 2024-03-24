const Book = require("../models/Book.js");

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
};
