
//  Implements a single business use case with domain-focused rules.

class UpdateCategory {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id, categoryData) {
    // Validate input ID
    if (!id) {
      throw new Error("Category ID is required");
    }

    // Validate input name if provided (must happen before findById for tests)
    if (categoryData.name !== undefined && categoryData.name.trim() === "") {
      throw new Error("Category name is required");
    }

    // Check if category exists
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error("Category not found");
    }

    // Check for duplicate name if a new name is provided
    if (
      categoryData.name !== undefined &&
      categoryData.name !== existingCategory.name
    ) {
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
