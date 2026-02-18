const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");


// Public
router.get("/", getComments);

// Protected
router.post("/", protect, createComment);

router.put("/:id", protect, updateComment);

router.delete("/:id", protect, deleteComment);


module.exports = router;
