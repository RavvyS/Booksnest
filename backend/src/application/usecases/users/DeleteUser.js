class DeleteUser {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this.userRepository.findByIdRaw(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // In a real system, you might want to prevent deleting the last librarian
    // but for this specific "access rejection" context, we just delete the user.
    
    return await this.userRepository.delete(userId);
  }
}

module.exports = DeleteUser;
