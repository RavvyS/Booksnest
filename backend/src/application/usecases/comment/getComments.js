
//  Implements a single business use case with domain-focused rules.

class GetComments {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute({ materialId, bookId }) {
    if (materialId) {
      return await this.commentRepository.findByMaterialId(materialId);
    }
    
    if (bookId) {
      return await this.commentRepository.findByBookId(bookId);
    }

    return await this.commentRepository.findAll();
  }
}

module.exports = GetComments;
