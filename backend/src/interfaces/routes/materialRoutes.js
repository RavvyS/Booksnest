//  Defines HTTP routes and middleware chain for this module.

const router = require("express").Router();

const MaterialController = require("../controllers/materialController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const RoleMiddleware = require("../middleware/RoleMiddleware");

// Public: Get all approved materials (optionally filter by category)
router.get("/", MaterialController.getAllMaterials);

// Protected: Get all pending materials (librarian only)
router.get(
    "/pending",
    AuthMiddleware,
    RoleMiddleware("librarian"),
    MaterialController.getPendingMaterials
);

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

// Protected: Approve or reject a material (librarian only)
router.patch(
    "/:id/approve",
    AuthMiddleware,
    RoleMiddleware("librarian"),
    MaterialController.approveMaterial
);

module.exports = router;
