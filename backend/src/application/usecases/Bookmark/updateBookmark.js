
//  Implements a single business use case with domain-focused rules.

class UpdateBookmark {
  constructor( bookmarkRepository ) {
    this.bookmarkRepository = bookmarkRepository;
  }

  async execute({ id, userId, materialId, note }) {

    const existingBookmark = await this.bookmarkRepository.findById(id);

    if (!existingBookmark) {
      throw new Error('Bookmark not found');
    }
    
    if (existingBookmark.userId.toString() !== userId) {
      throw new Error('Unauthorized');
    }
    

    const updatedBookmark = await this.bookmarkRepository.update(id, { note });
    return updatedBookmark;
  }

}
module.exports = UpdateBookmark;
