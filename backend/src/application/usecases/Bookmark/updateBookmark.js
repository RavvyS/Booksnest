
//  Implements a single business use case with domain-focused rules.

class UpdateBookmark {
  constructor( bookmarkRepository ) {
    this.bookmarkRepository = bookmarkRepository;
  }

  async execute({ id, userId, materialId, note, isFavorite, isCompleted, lastViewed }) {

    const existingBookmark = await this.bookmarkRepository.findById(id);

    if (!existingBookmark) {
      throw new Error('Bookmark not found');
    }
    
    if (existingBookmark.userId.toString() !== userId) {
      throw new Error('Unauthorized');
    }
    
    const updateData = {};
    if (note !== undefined) updateData.note = note;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;
    if (lastViewed !== undefined) updateData.lastViewed = lastViewed;

    const updatedBookmark = await this.bookmarkRepository.update(id, updateData);
    return updatedBookmark;
  }

}
module.exports = UpdateBookmark;
