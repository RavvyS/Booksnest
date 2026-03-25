
class ApproveBook {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute({ id, status }) {
    const validStatuses = ["approved", "rejected"];

    if (!status || !validStatuses.includes(status)) {
      throw new Error("Status must be 'approved' or 'rejected'");
    }

    const existing = await this.bookRepository.findById(id);
    if (!existing) {
      throw new Error("Book not found");
    }

    const updated = await this.bookRepository.approve(id, status);
    return updated;
  }
}

module.exports = ApproveBook;
