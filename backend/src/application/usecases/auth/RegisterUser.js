
//  Implements a single business use case with domain-focused rules.

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

    const requestedRole = (data.role || "reader").toLowerCase().trim();
    const allowedSelfRegisteredRoles = ["reader", "author", "librarian"];

    if (!allowedSelfRegisteredRoles.includes(requestedRole)) {
      throw new Error("Invalid role selection");
    }

    // Readers and Authors require approval. In a real system, the first librarian 
    // would be created via seed or an admin panel. For this implementation, 
    // we allow librarians to be auto-approved to manage the system.
    const isApproved = requestedRole === "librarian";

    const newUser = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: requestedRole,
      isApproved: isApproved,
    });

    return newUser;
  }

}

module.exports = RegisterUser;
