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
router.get("/external/free", BookController.getFreeExternalBooks);
router.get("/search-external", AuthMiddleware, RoleMiddleware("author", "librarian"), BookController.searchExternal);
router.get("/:bookId", BookController.getBookById);

// Secure read route (any authenticated user with valid borrow)
router.get("/:bookId/read", AuthMiddleware, BookController.readBook);

// Librarian or Author (Ownership check in controller/use case)
router.patch(
  "/:bookId/approve",
  AuthMiddleware,
  RoleMiddleware("librarian"),
  BookController.approveBook,
);

router.put(
  "/:bookId",
  AuthMiddleware,
  RoleMiddleware("author", "librarian"),
  BookController.updateBook,
);

router.delete(
  "/:bookId",
  AuthMiddleware,
  RoleMiddleware("author", "librarian"),
  BookController.deleteBook,
);

module.exports = router;
