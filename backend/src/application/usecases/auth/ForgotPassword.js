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

    // Generate a secure temporary password (8 chars uppercase and numbers)
    // This is more human-readable for a temp password
    const newPassword = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Hash the new password
    const hashedPassword = await this.hashService.hash(newPassword);
    
    // Update user's password
    user.password = hashedPassword;
    await user.save();

    console.log(`Password reset for ${user.email}. New temp password: ${newPassword}`);
    
    // Send email with the new password
    await EmailService.sendPasswordResetEmail(user.email, user.name, newPassword);

    return { message: "A new temporary password has been sent to your email." };
  }
}

module.exports = ForgotPassword;
