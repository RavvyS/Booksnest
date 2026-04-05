const TokenService = require("../../infrastructure/services/TokenService");
const UserRepository = require("../../infrastructure/repositories/UserRepository");

const userRepository = new UserRepository();

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = TokenService.verify(token);
    const user = await userRepository.findById(decoded.id);

    if (user) {
      req.user = {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
        name: user.name,
      };
    }
    next();
  } catch (error) {
    // If token is invalid/expired, we just don't populate req.user but still allow the request
    next();
  }
};
