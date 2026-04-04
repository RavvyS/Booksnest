//  Defines HTTP routes and middleware chain for this module.

const router = require("express").Router();

const BookController = require("../controllers/BookController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const RoleMiddleware = require("../middleware/RoleMiddleware");
const { upload } = require("../../infrastructure/services/multerBookUpload");

// Public routes
// Protected routes (Librarian/Author)
router.post(
  "/",
  AuthMiddleware,
  RoleMiddleware("author", "librarian"),
  upload.single("file"),
  BookController.createBook,
);

router.get(
  "/my-books",
  AuthMiddleware,
  RoleMiddleware("author"),
  BookController.getMyBooks,
);

router.get(
  "/pending",
  AuthMiddleware,
  RoleMiddleware("librarian"),
  BookController.getPendingBooks,
);

// Public routes
router.get("/", BookController.getAllBooks);
router.get("/:bookId", BookController.getBookById);
router.get("/external/free", BookController.getFreeExternalBooks);
router.get("/search-external", AuthMiddleware, RoleMiddleware("author", "librarian"), BookController.searchExternal);

// Secure read route (any authenticated user with valid borrow)
router.get("/:bookId/read", AuthMiddleware, BookController.readBook);

// Librarian only routes
router.patch(
  "/:bookId/approve",
  AuthMiddleware,
  RoleMiddleware("librarian"),
  BookController.approveBook,
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
