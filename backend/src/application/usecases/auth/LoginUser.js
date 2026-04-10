
//  Implements a single business use case with domain-focused rules.

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

    if (!user.isApproved) {
      throw new Error("Your account is pending approval by a librarian.");
    }

    const token = this.tokenService.generate(user);

    return { user, token };
  }

}

module.exports = LoginUser;