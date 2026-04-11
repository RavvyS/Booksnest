const router = require("express").Router();
const UserController = require("../controllers/UserController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const { isLibrarian } = require("../middleware/RoleMiddleware");

// Librarian routes for approvals and management
router.get("/pending", AuthMiddleware, isLibrarian, UserController.getPendingUsers);
router.post("/approve/:id", AuthMiddleware, isLibrarian, UserController.approveUser);
router.delete("/:id", AuthMiddleware, isLibrarian, UserController.deleteUser);

module.exports = router;
