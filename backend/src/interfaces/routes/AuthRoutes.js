const router = require("express").Router();

const AuthController = require("../controllers/AuthController");

const AuthMiddleware = require("../middleware/AuthMiddleware");


router.post("/register", AuthController.register);

router.post("/login", AuthController.login);

router.get(
  "/profile",
  AuthMiddleware,
  AuthController.profile
);


module.exports = router;