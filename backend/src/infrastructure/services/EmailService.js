const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ravindusdc@gmail.com",
        pass: "macaozvjbwogckhi",
      },
    });
  }

  async sendApprovalEmail(to, name) {
    const mailOptions = {
      from: "\"BookNest\" <ravindusdc@gmail.com>",
      to,
      subject: "Account Approved - BookNest",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2e7d32;">Welcome to BookNest!</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Great news! Your account has been approved by our librarian.</p>
          <p>You can now log in to access all our learning materials and features.</p>
          <div style="margin: 30px 0;">
            <a href="http://localhost:5173/login" style="background-color: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Login to Your Account</a>
          </div>
          <p>Happy learning,<br>The BookNest Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Approval email sent to ${to}`);
    } catch (error) {
      console.error("Error sending approval email:", error);
    }
  }

  async sendPasswordResetEmail(to, name, newPassword) {
    const mailOptions = {
      from: "\"BookNest\" <ravindusdc@gmail.com>",
      to,
      subject: "Password Reset - BookNest",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #1a73e8;">Password Reset Request</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your password has been reset by the system as requested.</p>
          <p>Your new temporary password is: <strong style="font-size: 1.2rem; background: #f4f4f4; padding: 5px 10px; border-radius: 4px;">${newPassword}</strong></p>
          <p>For security reasons, please change this password immediately after logging in.</p>
          <div style="margin: 30px 0;">
            <a href="http://localhost:5173/login" style="background-color: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Login Now</a>
          </div>
          <p>If you did not request this, please contact support immediately.</p>
          <p>Best regards,<br>The BookNest Team</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${to}`);
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  }
}

module.exports = new EmailService();
