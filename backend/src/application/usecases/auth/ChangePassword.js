class ChangePassword {
  constructor(userRepository, hashService) {
    this.userRepository = userRepository;
    this.hashService = hashService;
  }

  async execute(userId, { oldPassword, newPassword }) {
    const user = await this.userRepository.findByIdRaw(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await this.hashService.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Incorrect current password.");
    }

    const hashedPassword = await this.hashService.hash(newPassword);
    user.password = hashedPassword;
    await user.save();

    return { message: "Password updated successfully." };
  }
}

module.exports = ChangePassword;
