class GetBookmarks {
  constructor(bookmarkRepository) {
    this.bookmarkRepository = bookmarkRepository;
  }

  async execute({ userId }) {
    return await this.bookmarkRepository.findByUserId(userId);
  }
}
module.exports = GetBookmarks;