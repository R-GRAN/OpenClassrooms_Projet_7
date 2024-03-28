const Book = require("../models/Book.js");
const fs = require("fs");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (book) res.status(200).json(book);
    else res.status(404).json({ error });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.getBestRatingBooks = async (req, res) => {
  try {
    const bestBooks = await Book.find().sort({ rating: -1 }).limit(3);
    res.status(200).json(bestBooks);
  } catch (error) {
    res.status(500).json({ error });
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

    res.status(201).json({ message: "Livre créé !" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.createRatingBook = async (req, res) => {
  try {
    const id = req.params.id;

    const rating = req.body.rating;
    const userId = req.auth.userId;

    const book = await Book.findOne({ _id: id });

    if (!book) return res.status(404).json("Livre introuvable");

    const ratings = book.ratings;
    const haveAlreadyRate = ratings.find((rating) => rating.userId === userId);
    if (haveAlreadyRate != null) {
      return res.status(400).json("Vous avez déjà voté pour ce livre");
    }

    const newRating ={userId: userId, grade: rating}

  ratings.push(newRating);

  book.averageRating = averageRating(ratings)

  function averageRating(ratings){
    const sumOfAllRating = ratings.reduce((sum,rating)=>sum + rating.grade,0)
    return sumOfAllRating/ratings.length
  }

  const updatedBook = await book.save()

      res.status(200).json(updatedBook);

  } catch (error) {
    res
      .status(500)
      .json({ error });
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

    if (book.userId != req.auth.userId)
      return res.status(401).json({ message: "Not authorized" });

    const updatedBook = await Book.updateOne(
      { _id: req.params.id },
      { ...bookObject, _id: req.params.id }
    );

    if (updatedBook) {
      res.status(200).json({ message: "Livre modifié!" });
    } else {
      res.status(400).json({ error: "Erreur lors de la modification " });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ message: "Livre introuvable" });
    }

    if (book.userId != req.auth.userId)
      return res.status(401).json({ message: "Not authorized" });

    const filename = book.imageUrl.split("/images/")[1];

    fs.unlink(`images/${filename}`, () => {
      Book.deleteOne({ _id: req.params.id }).then(() => {
        res.status(200).json({ message: "Livre supprimé !" });
      });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};
