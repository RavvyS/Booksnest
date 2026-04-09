
//  Implements a single business use case with domain-focused rules.

class DeleteBook {
  constructor(bookRepository) {
    this.bookRepository = bookRepository;
  }

  async execute(id, userId, userRole) {
    if (!id) {
      throw new Error("Book ID is required");
    }

    const existing = await this.bookRepository.findById(id);
    if (!existing) {
      throw new Error("Book not found");
    }

    if (userRole !== "librarian" && existing.uploadedBy !== userId) {
      throw new Error("Unauthorized: You can only delete your own submissions");
    }

    const result = await this.bookRepository.delete(id);
    if (!result) {
      throw new Error("Failed to delete book");
    }

    return { message: "Book deleted successfully" };
  }
}

module.exports = DeleteBook;
