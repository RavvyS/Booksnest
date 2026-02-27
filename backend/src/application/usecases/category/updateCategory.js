
//  Implements a single business use case with domain-focused rules.

class UpdateCategory {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id, categoryData) {
    // Validate input
    if (!id) {
      throw new Error("Category ID is required");
    }

    if (!categoryData.name || categoryData.name.trim() === "") {
      throw new Error("Category name is required");
    }

    // Check if category exists
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error("Category not found");
    }

    // Check if new name conflicts with another category
    if (categoryData.name !== existingCategory.name) {
      const duplicateCategory = await this.categoryRepository.findByName(
        categoryData.name,
      );
      if (duplicateCategory && duplicateCategory.id !== id) {
        throw new Error("Category with this name already exists");
      }
    }

    // Update category
    return await this.categoryRepository.update(id, categoryData);
  }
}

module.exports = UpdateCategory;
