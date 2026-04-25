const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = null;
  }

  getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
    return this.transporter;
  }

  async sendApprovalEmail(to, name) {
    const transporter = this.getTransporter();
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: "Account Approved - Booksnest",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #043A82; margin: 0;">Booksnest</h1>
          </div>
          <h2 style="color: #10B981; border-bottom: 2px solid #10B981; padding-bottom: 10px;">Welcome Aboard!</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>We are pleased to inform you that your registration at Booksnest has been <strong>approved</strong> by our librarian.</p>
          <p>You now have full access to our digital library and learning materials.</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="http://localhost:5173/login" style="background: linear-gradient(135deg, #043A82 0%, #0653B8 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 4px 15px rgba(4, 58, 130, 0.2);">Login to Your Account</a>
          </div>
          <p style="color: #666; font-size: 0.9em;">If you have any questions, feel free to reply to this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="text-align: center; color: #999; font-size: 0.8em;">Happy reading,<br>The Booksnest Team</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Approval email sent to ${to}`);
    } catch (error) {
      console.error("Error sending approval email:", error);
    }
  }

  async sendPasswordResetEmail(to, name, newPassword) {
    const transporter = this.getTransporter();
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: "Temporary Password - Booksnest",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #043A82; margin: 0;">Booksnest</h1>
          </div>
          <h2 style="color: #F59E0B; border-bottom: 2px solid #F59E0B; padding-bottom: 10px;">Password Reset Request</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>We received a request to reset your password. Here is your system-generated temporary password:</p>
          <div style="text-align: center; margin: 25px 0;">
            <div style="display: inline-block; background: #f8fbff; border: 2px dashed #0653B8; padding: 15px 30px; border-radius: 8px; font-family: monospace; font-size: 1.8em; color: #043A82; letter-spacing: 2px;">
              ${newPassword}
            </div>
          </div>
          <p><strong>Security Note:</strong> Please use this password to log in and change your password immediately in your profile settings.</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="http://localhost:5173/login" style="background: linear-gradient(135deg, #043A82 0%, #0653B8 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 4px 15px rgba(4, 58, 130, 0.2);">Login Now</a>
          </div>
          <p style="color: #ED4337; font-size: 0.85em;"><em>If you did not request this, please secure your account immediately.</em></p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="text-align: center; color: #999; font-size: 0.8em;">Best regards,<br>The Booksnest Team</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${to}`);
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  }
}

module.exports = new EmailService();
