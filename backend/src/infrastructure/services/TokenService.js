//  Provides a reusable infrastructure-level service utility.

const jwt = require("jsonwebtoken");

class TokenService {
  ensureSecret() {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }
  }

  generate(user) {
    this.ensureSecret();

    return jwt.sign(
      {
        id: user._id || user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
  }

  verify(token) {
    this.ensureSecret();
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  generateReadToken(userId, bookId) {
    this.ensureSecret();
    return jwt.sign(
      { userId, bookId, type: "read_pdf" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
  }

  verifyReadToken(token) {
    this.ensureSecret();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "read_pdf") {
      throw new Error("Invalid token type");
    }
    return decoded;
  }

}

module.exports = new TokenService();
