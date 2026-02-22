class GetComments {
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }

  async execute({ materialId }) {
    if (materialId) {
      return await this.commentRepository.findByMaterialId(materialId);
    }

    return await this.commentRepository.findAll();
  }
}

module.exports = GetComments;
