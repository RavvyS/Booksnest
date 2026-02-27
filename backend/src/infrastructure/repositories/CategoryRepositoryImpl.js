const CategoryRepository = require("../../domain/repositories/CategoryRepository");
const CategoryModel = require("../database/schemas/CategorySchema");
const Category = require("../../domain/entities/Category");

class CategoryRepositoryImpl extends CategoryRepository {
  async create(category) {
    const newCategory = new CategoryModel({
      name: category.name,
      description: category.description,
    });
    const savedCategory = await newCategory.save();
    return new Category({
      id: savedCategory._id.toString(),
      name: savedCategory.name,
      description: savedCategory.description,
      createdAt: savedCategory.createdAt,
      updatedAt: savedCategory.updatedAt,
    });
  }

  async findAll() {
    const categories = await CategoryModel.find().sort({ name: 1 });
    return categories.map(
      (cat) =>
        new Category({
          id: cat._id.toString(),
          name: cat.name,
          description: cat.description,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
        }),
    );
  }

  async findById(id) {
    const category = await CategoryModel.findById(id);
    if (!category) return null;
    return new Category({
      id: category._id.toString(),
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  }

  async findByName(name) {
    const category = await CategoryModel.findOne({ name });
    if (!category) return null;
    return new Category({
      id: category._id.toString(),
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  }

  async update(id, categoryData) {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      {
        name: categoryData.name,
        description: categoryData.description,
      },
      { new: true, runValidators: true },
    );
    if (!updatedCategory) return null;
    return new Category({
      id: updatedCategory._id.toString(),
      name: updatedCategory.name,
      description: updatedCategory.description,
      createdAt: updatedCategory.createdAt,
      updatedAt: updatedCategory.updatedAt,
    });
  }

  async delete(id) {
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    return deletedCategory !== null;
  }
}

module.exports = CategoryRepositoryImpl;
