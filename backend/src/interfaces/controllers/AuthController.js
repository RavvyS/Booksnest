const UserRepository = require("../../infrastructure/repositories/UserRepository");
const HashService = require("../../infrastructure/services/HashService");
const TokenService = require("../../infrastructure/services/TokenService");

const RegisterUser = require("../../application/usecases/auth/RegisterUser");
const LoginUser = require("../../application/usecases/auth/LoginUser");

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

    const token = TokenService.generate(user);

    res.status(201).json({ user: sanitizeUser(user), token });

  } catch (error) {

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

    res.status(400).json({ message: error.message });

  }

};
