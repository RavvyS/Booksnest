const EmailService = require("../../../infrastructure/services/EmailService");

class ApproveUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this.userRepository.findByIdRaw(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isApproved) {
      throw new Error("User is already approved");
    }

    user.isApproved = true;
    await user.save();

    // Send confirmation email
    await EmailService.sendApprovalEmail(user.email, user.name);

    return user;
  }
}

module.exports = ApproveUser;
