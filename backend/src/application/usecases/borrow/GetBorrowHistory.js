class GetBorrowHistory {
  constructor(borrowRepository) {
    this.borrowRepository = borrowRepository;
  }

  async execute(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    return await this.borrowRepository.findByUser(userId);
  }
}

module.exports = GetBorrowHistory;
