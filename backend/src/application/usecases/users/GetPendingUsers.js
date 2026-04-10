class GetPendingUsers {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute() {
    return await this.userRepository.findPending();
  }
}

module.exports = GetPendingUsers;
