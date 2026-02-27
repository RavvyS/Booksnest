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
  RoleMiddleware("reader"),
  BorrowController.createQueueRequest,
);
router.get(
  "/queue/my",
  AuthMiddleware,
  RoleMiddleware("reader"),
  BorrowController.getMyQueueRequests,
);
router.put(
  "/queue/:requestId",
  AuthMiddleware,
  RoleMiddleware("reader"),
  BorrowController.updateQueueRequest,
);
router.delete(
  "/queue/:requestId",
  AuthMiddleware,
  RoleMiddleware("reader"),
  BorrowController.cancelQueueRequest,
);

module.exports = router;
