class LoginUser {

  constructor(userRepository, hashService, tokenService) {
    this.userRepository = userRepository;
    this.hashService = hashService;
    this.tokenService = tokenService;
  }

  async execute({ email, password }) {

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await this.hashService.compare(
      password,
      user.password
    );

    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const token = this.tokenService.generate(user);

    return { user, token };
  }

}

module.exports = LoginUser;