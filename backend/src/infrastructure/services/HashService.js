const bcrypt = require("bcrypt");

class HashService {

  async hash(password) {
    return await bcrypt.hash(password, 10);
  }

  async compare(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

}

module.exports = new HashService();