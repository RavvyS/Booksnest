//  Handles HTTP request/response mapping and delegates business logic to use cases.

const CategoryRepositoryImpl = require("../../infrastructure/repositories/CategoryRepositoryImpl");
const CreateCategory = require("../../application/usecases/category/createCategory");
const GetCategories = require("../../application/usecases/category/getCategories");
const UpdateCategory = require("../../application/usecases/category/updateCategory");
const DeleteCategory = require("../../application/usecases/category/deleteCategory");

const repository = new CategoryRepositoryImpl();
const createUseCase = new CreateCategory(repository);
const getUseCase = new GetCategories(repository);
const updateUseCase = new UpdateCategory(repository);
const deleteUseCase = new DeleteCategory(repository);

exports.createCategory = async (req, res) => {
  try {
    const result = await createUseCase.execute({
      name: req.body.name,
      description: req.body.description,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const result = await getUseCase.execute();
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const result = await getUseCase.executeById(req.params.categoryId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const result = await updateUseCase.execute(req.params.categoryId, {
      name: req.body.name,
      description: req.body.description,
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const result = await deleteUseCase.execute(req.params.categoryId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
