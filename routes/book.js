const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRatingBooks);
router.get("/:id", bookCtrl.getBookById);

router.post("/", auth, multer, bookCtrl.createBook);

module.exports = router;
