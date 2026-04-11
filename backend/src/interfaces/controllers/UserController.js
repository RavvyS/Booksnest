const UserRepository = require("../../infrastructure/repositories/UserRepository");
const GetPendingUsers = require("../../application/usecases/users/GetPendingUsers");
const ApproveUser = require("../../application/usecases/users/ApproveUser");
const DeleteUser = require("../../application/usecases/users/DeleteUser");

const userRepository = new UserRepository();
const getPendingUsersUseCase = new GetPendingUsers(userRepository);
const approveUserUseCase = new ApproveUser(userRepository);
const deleteUserUseCase = new DeleteUser(userRepository);

exports.getPendingUsers = async (req, res) => {
  try {
    const users = await getPendingUsersUseCase.execute();
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const user = await approveUserUseCase.execute(req.params.id);
    res.json({ message: "User approved successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await deleteUserUseCase.execute(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
