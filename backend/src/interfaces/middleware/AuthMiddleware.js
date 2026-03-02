//  Applies cross-cutting request validation and authorization checks.

const TokenService = require("../../infrastructure/services/TokenService");
const UserRepository = require("../../infrastructure/repositories/UserRepository");

const userRepository = new UserRepository();

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    const decoded = TokenService.verify(token);
    const user = await userRepository.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found for token",
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    res.status(500).json({
      message: "Authentication failed",
      error: error.message,
    });
  }
};
