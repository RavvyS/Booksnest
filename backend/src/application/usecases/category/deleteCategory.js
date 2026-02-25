class DeleteCategory {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id) {
    // Validate input
    if (!id) {
      throw new Error("Category ID is required");
    }

    // Check if category exists
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error("Category not found");
    }

    // Delete category
    const result = await this.categoryRepository.delete(id);
    if (!result) {
      throw new Error("Failed to delete category");
    }

    return { message: "Category deleted successfully" };
  }
}

module.exports = DeleteCategory;
