const router = require("express").Router();

const CommentController = require("../controllers/commentController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const RoleMiddleware = require("../middleware/RoleMiddleware");

router.get("/", CommentController.getComments);

router.post(
  "/",
  AuthMiddleware,
  RoleMiddleware("reader", "author", "librarian"),
  CommentController.createComment
);

router.put(
  "/:commentId",
  AuthMiddleware,
  RoleMiddleware("reader", "author", "librarian"),
  CommentController.updateComment
);

router.delete(
  "/:commentId",
  AuthMiddleware,
  RoleMiddleware("reader", "author", "librarian"),
  CommentController.deleteComment
);

module.exports = router;
