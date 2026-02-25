const Category = require("../../../domain/entities/Category");

class CreateCategory {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(categoryData) {
    // Validate input
    if (!categoryData.name || categoryData.name.trim() === "") {
      throw new Error("Category name is required");
    }

    // Check if category already exists
    const existingCategory = await this.categoryRepository.findByName(
      categoryData.name,
    );
    if (existingCategory) {
      throw new Error("Category with this name already exists");
    }

    // Create new category
    const category = new Category({
      name: categoryData.name,
      description: categoryData.description || "",
    });

    return await this.categoryRepository.create(category);
  }
}

module.exports = CreateCategory;
