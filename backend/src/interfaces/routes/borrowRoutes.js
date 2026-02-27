const router = require("express").Router();

const BorrowController = require("../controllers/BorrowController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

// All routes require authentication
router.post("/borrow/:bookId", AuthMiddleware, BorrowController.borrowBook);
router.post("/return/:bookId", AuthMiddleware, BorrowController.returnBook);
router.get("/my-borrows", AuthMiddleware, BorrowController.getMyBorrows);

module.exports = router;
