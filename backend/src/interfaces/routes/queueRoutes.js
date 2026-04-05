//  Defines HTTP routes for Queue functionality.

const router = require("express").Router();
const QueueController = require("../controllers/QueueController");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const RoleMiddleware = require("../middleware/RoleMiddleware");

// All routes require authentication and are restricted to Readers
router.use(AuthMiddleware);
router.use(RoleMiddleware("reader"));

router.post("/:bookId", QueueController.createQueueRequest);
router.get("/my", QueueController.getMyQueueRequests);
router.put("/:requestId", QueueController.updateQueueRequest);
router.delete("/:requestId", QueueController.cancelQueueRequest);

module.exports = router;
