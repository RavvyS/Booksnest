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

}

module.exports = new TokenService();
