
//  Implements a single business use case with domain-focused rules.

class GetBookmarks {
  constructor(bookmarkRepository) {
    this.bookmarkRepository = bookmarkRepository;
  }

  async execute({ userId }) {
    return await this.bookmarkRepository.findByUserId(userId);
  }
}
module.exports = GetBookmarks;