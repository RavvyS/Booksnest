const router = require("express").Router();

const MaterialController = require("../controllers/materialController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const RoleMiddleware = require("../middleware/RoleMiddleware");

// Public: Get all approved materials (optionally filter by category)
router.get("/", MaterialController.getAllMaterials);

// Public: Get material by ID
router.get("/:id", MaterialController.getMaterialById);

// Protected: Create material (author or librarian only)
router.post(
    "/",
    AuthMiddleware,
    RoleMiddleware("author", "librarian"),
    MaterialController.createMaterial
);

// Protected: Update material (author or librarian only)
router.put(
    "/:id",
    AuthMiddleware,
    RoleMiddleware("author", "librarian"),
    MaterialController.updateMaterial
);

// Protected: Delete material (author or librarian only)
router.delete(
    "/:id",
    AuthMiddleware,
    RoleMiddleware("author", "librarian"),
    MaterialController.deleteMaterial
);

module.exports = router;
