//  Defines HTTP routes and middleware chain for this module.

const router = require("express").Router();

const BorrowController = require("../controllers/BorrowController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const RoleMiddleware = require("../middleware/RoleMiddleware");

// All routes require authentication
router.post("/borrow/:bookId", AuthMiddleware, BorrowController.borrowBook);
router.post("/return/:bookId", AuthMiddleware, BorrowController.returnBook);
router.get("/my-borrows", AuthMiddleware, BorrowController.getMyBorrows);

// Queue routes (Readers)
router.post(
  "/queue/:bookId",
  AuthMiddleware,
  RoleMiddleware("reader", "author"),
  BorrowController.createQueueRequest,
);
router.get(
  "/queue/my",
  AuthMiddleware,
  RoleMiddleware("reader", "author"),
  BorrowController.getMyQueueRequests,
);
router.get(
  "/queue/book/:bookId/status",
  AuthMiddleware,
  RoleMiddleware("reader", "author"),
  BorrowController.getQueueStatus,
);
router.put(
  "/queue/:requestId",
  AuthMiddleware,
  RoleMiddleware("reader", "author"),
  BorrowController.updateQueueRequest,
);
router.delete(
  "/queue/:requestId",
  AuthMiddleware,
  RoleMiddleware("reader", "author"),
  BorrowController.cancelQueueRequest,
);

// Librarian management routes
router.get(
  "/queue/book/:bookId",
  AuthMiddleware,
  BorrowController.getBookQueue,
);
router.delete(
  "/queue/admin/:requestId",
  AuthMiddleware,
  RoleMiddleware("librarian"),
  BorrowController.librarianCancelQueue,
);

module.exports = router;
