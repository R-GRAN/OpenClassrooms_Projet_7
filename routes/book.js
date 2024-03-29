const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book");
const auth = require("../middlewares/auth");
const { upload, imageMiddleware } = require("../middlewares/multer-config");

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRatingBooks);
router.get("/:id", bookCtrl.getBookById);

router.post("/", auth, upload, imageMiddleware, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.createRatingBook);

router.put("/:id", auth, upload, imageMiddleware, bookCtrl.modifyBook);

router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
