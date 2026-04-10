const EmailService = require("../../../infrastructure/services/EmailService");
const crypto = require("crypto");

class ForgotPassword {
  constructor(userRepository, hashService) {
    this.userRepository = userRepository;
    this.hashService = hashService;
  }

  async execute(email) {
    const user = await this.userRepository.findByEmailRaw(email);
    if (!user) {
      throw new Error("No account found with this email address.");
    }

    // Generate a secure random password (8 chars)
    const newPassword = crypto.randomBytes(4).toString("hex");
    
    // Hash the new password
    const hashedPassword = await this.hashService.hash(newPassword);
    
    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Send email with the new password
    await EmailService.sendPasswordResetEmail(user.email, user.name, newPassword);

    return { message: "A new password has been sent to your email." };
  }
}

module.exports = ForgotPassword;
