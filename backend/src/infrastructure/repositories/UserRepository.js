const UserModel = require("../database/UserModel");

class UserRepository {

  async create(userData) {
    const user = new UserModel(userData);
    return await user.save();
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async findById(id) {
    return await UserModel.findById(id).select("-password");
  }

}

module.exports = UserRepository;