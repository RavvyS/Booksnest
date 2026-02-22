class RegisterUser {

  constructor(userRepository, hashService) {
    this.userRepository = userRepository;
    this.hashService = hashService;
  }

  async execute(data) {
    if (!data.name || !data.email || !data.password) {
      throw new Error("Name, email and password are required");
    }

    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await this.hashService.hash(data.password);

    const requestedRole = data.role || "reader";
    const allowedSelfRegisteredRoles = ["reader", "author"];

    if (!allowedSelfRegisteredRoles.includes(requestedRole)) {
      throw new Error("Invalid role selection");
    }

    const newUser = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: requestedRole,
    });

    return newUser;
  }

}

module.exports = RegisterUser;
