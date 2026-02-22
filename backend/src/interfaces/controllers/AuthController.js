const UserRepository = require("../../infrastructure/repositories/UserRepository");
const HashService = require("../../infrastructure/services/HashService");
const TokenService = require("../../infrastructure/services/TokenService");

const RegisterUser = require("../../application/use-cases/auth/RegisterUser");
const LoginUser = require("../../application/use-cases/auth/LoginUser");

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


exports.register = async (req, res) => {

  try {

    const user = await registerUseCase.execute(req.body);

    const token = TokenService.generate(user);

    res.json({ user, token });

  } catch (error) {

    res.status(400).json({ message: error.message });

  }

};


exports.login = async (req, res) => {

  try {

    const result = await loginUseCase.execute(req.body);

    res.json(result);

  } catch (error) {

    res.status(400).json({ message: error.message });

  }

};


exports.profile = async (req, res) => {

  try {

    const user = await userRepository.findById(req.user.id);

    res.json(user);

  } catch (error) {

    res.status(400).json({ message: error.message });

  }

};