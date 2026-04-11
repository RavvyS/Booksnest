//  Implements persistence operations against MongoDB models.

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

  async findByIdRaw(id) {
    return await UserModel.findById(id);
  }

  async findByEmailRaw(email) {
    return await UserModel.findOne({ email });
  }

  async findPending() {
    return await UserModel.find({ isApproved: false }).select("-password");
  }

  async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }

}

module.exports = UserRepository;