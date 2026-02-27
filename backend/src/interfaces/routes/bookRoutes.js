const router = require("express").Router();

const BookController = require("../controllers/BookController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const RoleMiddleware = require("../middleware/RoleMiddleware");
const { upload } = require("../../infrastructure/services/multerBookUpload");

// Public routes
router.get("/", BookController.getAllBooks);
router.get("/:bookId", BookController.getBookById);

// Secure read route (any authenticated user with valid borrow)
router.get("/:bookId/read", AuthMiddleware, BookController.readBook);

// Protected routes (Librarian only)
router.post(
  "/",
  AuthMiddleware,
  RoleMiddleware("librarian"),
  upload.single("file"),
  BookController.createBook,
);

router.put(
  "/:bookId",
  AuthMiddleware,
  RoleMiddleware("librarian"),
  BookController.updateBook,
);

router.delete(
  "/:bookId",
  AuthMiddleware,
  RoleMiddleware("librarian"),
  BookController.deleteBook,
);

module.exports = router;
