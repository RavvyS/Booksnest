//  Handles HTTP request/response mapping and delegates business logic to use cases.

const UserRepository = require("../../infrastructure/repositories/UserRepository");
const HashService = require("../../infrastructure/services/HashService");
const TokenService = require("../../infrastructure/services/TokenService");

const RegisterUser = require("../../application/usecases/auth/RegisterUser");
const LoginUser = require("../../application/usecases/auth/LoginUser");
const ForgotPassword = require("../../application/usecases/auth/ForgotPassword");
const ChangePassword = require("../../application/usecases/auth/ChangePassword");

const userRepository = new UserRepository();

const registerUseCase = new RegisterUser(
  userRepository,
  HashService
);

const loginUseCase = new LoginUser(
  userRepository,
  HashService,
  TokenService
);

const forgotPasswordUseCase = new ForgotPassword(
  userRepository,
  HashService
);

const changePasswordUseCase = new ChangePassword(
  userRepository,
  HashService
);

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});


exports.register = async (req, res) => {

  try {

    const user = await registerUseCase.execute(req.body);

    // Only generate token if the user is auto-approved (e.g. Librarian)
    let token = null;
    if (user.isApproved) {
      token = TokenService.generate(user);
    }

    res.status(201).json({ 
      user: sanitizeUser(user), 
      token, 
      message: user.isApproved ? "Registration successful" : "Registration successful, pending approval."
    });

  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await loginUseCase.execute(req.body);
    res.json({
      user: sanitizeUser(result.user),
      token: result.token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.profile = async (req, res) => {

  try {

    const user = await userRepository.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(sanitizeUser(user));

  } catch (error) {

    res.status(401).json({ message: error.message });

  }

};


exports.forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordUseCase.execute(req.body.email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const result = await changePasswordUseCase.execute(req.user.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
