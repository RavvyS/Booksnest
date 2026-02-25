class GetCategories {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute() {
    return await this.categoryRepository.findAll();
  }

  async executeById(id) {
    if (!id) {
      throw new Error("Category ID is required");
    }

    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }

    return category;
  }
}

module.exports = GetCategories;
