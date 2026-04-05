//  Defines HTTP routes and middleware chain for this module.

const router = require("express").Router();

const BorrowController = require("../controllers/BorrowController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const RoleMiddleware = require("../middleware/RoleMiddleware");

// All routes require authentication
router.post("/borrow/:bookId", AuthMiddleware, BorrowController.borrowBook);
router.post("/return/:bookId", AuthMiddleware, BorrowController.returnBook);
router.get("/my-borrows", AuthMiddleware, BorrowController.getMyBorrows);

// No queue routes here anymore, they moved to queueRoutes.js

module.exports = router;
