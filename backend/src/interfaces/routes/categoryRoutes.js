const router = require("express").Router();

const CategoryController = require("../controllers/CategoryController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const RoleMiddleware = require("../middleware/RoleMiddleware");

// Public routes
router.get("/", CategoryController.getAllCategories);
router.get("/:categoryId", CategoryController.getCategoryById);

// Protected routes (Librarian only)
router.post(
  "/",
  AuthMiddleware,
  RoleMiddleware("librarian"),
  CategoryController.createCategory,
);

router.put(
  "/:categoryId",
  AuthMiddleware,
  RoleMiddleware("librarian"),
  CategoryController.updateCategory,
);

router.delete(
  "/:categoryId",
  AuthMiddleware,
  RoleMiddleware("librarian"),
  CategoryController.deleteCategory,
);

module.exports = router;
