const CreateCategory = require("../../src/application/usecases/category/createCategory");
const GetCategories = require("../../src/application/usecases/category/getCategories");
const UpdateCategory = require("../../src/application/usecases/category/updateCategory");
const DeleteCategory = require("../../src/application/usecases/category/deleteCategory");

describe("Category use cases", () => {
  describe("CreateCategory", () => {
    test("throws when name is missing", async () => {
      const repo = {
        findByName: jest.fn(),
        create: jest.fn(),
      };
      const useCase = new CreateCategory(repo);

      await expect(
        useCase.execute({
          name: "   ",
          description: "desc",
        }),
      ).rejects.toThrow("Category name is required");

      expect(repo.findByName).not.toHaveBeenCalled();
      expect(repo.create).not.toHaveBeenCalled();
    });

    test("throws when category with same name exists", async () => {
      const existing = { id: "c1", name: "Fiction" };
      const repo = {
        findByName: jest.fn().mockResolvedValue(existing),
        create: jest.fn(),
      };
      const useCase = new CreateCategory(repo);

      await expect(
        useCase.execute({
          name: "Fiction",
          description: "desc",
        }),
      ).rejects.toThrow("Category with this name already exists");

      expect(repo.findByName).toHaveBeenCalledWith("Fiction");
      expect(repo.create).not.toHaveBeenCalled();
    });

    test("creates category when data is valid and unique", async () => {
      const created = {
        id: "c2",
        name: "Science",
        description: "Science books",
      };
      const repo = {
        findByName: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(created),
      };
      const useCase = new CreateCategory(repo);

      const result = await useCase.execute({
        name: "Science",
        description: "Science books",
      });

      expect(repo.findByName).toHaveBeenCalledWith("Science");
      expect(repo.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(created);
    });
  });

  describe("GetCategories", () => {
    test("returns all categories", async () => {
      const categories = [
        { id: "c1", name: "A", description: "" },
        { id: "c2", name: "B", description: "" },
      ];
      const repo = {
        findAll: jest.fn().mockResolvedValue(categories),
        findById: jest.fn(),
      };
      const useCase = new GetCategories(repo);

      const result = await useCase.execute();

      expect(repo.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(categories);
    });

    test("throws when id is missing in executeById", async () => {
      const repo = {
        findAll: jest.fn(),
        findById: jest.fn(),
      };
      const useCase = new GetCategories(repo);

      await expect(useCase.executeById("")).rejects.toThrow(
        "Category ID is required",
      );
      expect(repo.findById).not.toHaveBeenCalled();
    });

    test("throws when category is not found in executeById", async () => {
      const repo = {
        findAll: jest.fn(),
        findById: jest.fn().mockResolvedValue(null),
      };
      const useCase = new GetCategories(repo);

      await expect(useCase.executeById("missing-id")).rejects.toThrow(
        "Category not found",
      );
      expect(repo.findById).toHaveBeenCalledWith("missing-id");
    });

    test("returns category when found in executeById", async () => {
      const category = { id: "c1", name: "Fiction", description: "" };
      const repo = {
        findAll: jest.fn(),
        findById: jest.fn().mockResolvedValue(category),
      };
      const useCase = new GetCategories(repo);

      const result = await useCase.executeById("c1");

      expect(repo.findById).toHaveBeenCalledWith("c1");
      expect(result).toBe(category);
    });
  });

  describe("UpdateCategory", () => {
    test("throws when id is missing", async () => {
      const repo = {
        findById: jest.fn(),
        findByName: jest.fn(),
        update: jest.fn(),
      };
      const useCase = new UpdateCategory(repo);

      await expect(
        useCase.execute("", { name: "New", description: "" }),
      ).rejects.toThrow("Category ID is required");

      expect(repo.findById).not.toHaveBeenCalled();
    });

    test("throws when name is missing", async () => {
      const repo = {
        findById: jest.fn(),
        findByName: jest.fn(),
        update: jest.fn(),
      };
      const useCase = new UpdateCategory(repo);

      await expect(
        useCase.execute("c1", { name: "   ", description: "" }),
      ).rejects.toThrow("Category name is required");

      expect(repo.findById).not.toHaveBeenCalled();
    });

    test("throws when category does not exist", async () => {
      const repo = {
        findById: jest.fn().mockResolvedValue(null),
        findByName: jest.fn(),
        update: jest.fn(),
      };
      const useCase = new UpdateCategory(repo);

      await expect(
        useCase.execute("c1", { name: "New", description: "" }),
      ).rejects.toThrow("Category not found");

      expect(repo.findById).toHaveBeenCalledWith("c1");
      expect(repo.findByName).not.toHaveBeenCalled();
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("throws when new name conflicts with another category", async () => {
      const existingCategory = { id: "c1", name: "Old" };
      const conflictingCategory = { id: "c2", name: "New" };
      const repo = {
        findById: jest.fn().mockResolvedValue(existingCategory),
        findByName: jest.fn().mockResolvedValue(conflictingCategory),
        update: jest.fn(),
      };
      const useCase = new UpdateCategory(repo);

      await expect(
        useCase.execute("c1", { name: "New", description: "" }),
      ).rejects.toThrow("Category with this name already exists");

      expect(repo.findById).toHaveBeenCalledWith("c1");
      expect(repo.findByName).toHaveBeenCalledWith("New");
      expect(repo.update).not.toHaveBeenCalled();
    });

    test("updates category when data is valid", async () => {
      const existingCategory = { id: "c1", name: "Old" };
      const updatedCategory = { id: "c1", name: "New", description: "" };
      const repo = {
        findById: jest.fn().mockResolvedValue(existingCategory),
        findByName: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue(updatedCategory),
      };
      const useCase = new UpdateCategory(repo);

      const result = await useCase.execute("c1", {
        name: "New",
        description: "",
      });

      expect(repo.findById).toHaveBeenCalledWith("c1");
      expect(repo.findByName).toHaveBeenCalledWith("New");
      expect(repo.update).toHaveBeenCalledWith("c1", {
        name: "New",
        description: "",
      });
      expect(result).toBe(updatedCategory);
    });
  });

  describe("DeleteCategory", () => {
    test("throws when id is missing", async () => {
      const repo = {
        findById: jest.fn(),
        delete: jest.fn(),
      };
      const useCase = new DeleteCategory(repo);

      await expect(useCase.execute("")).rejects.toThrow(
        "Category ID is required",
      );
      expect(repo.findById).not.toHaveBeenCalled();
    });

    test("throws when category does not exist", async () => {
      const repo = {
        findById: jest.fn().mockResolvedValue(null),
        delete: jest.fn(),
      };
      const useCase = new DeleteCategory(repo);

      await expect(useCase.execute("missing-id")).rejects.toThrow(
        "Category not found",
      );
      expect(repo.findById).toHaveBeenCalledWith("missing-id");
      expect(repo.delete).not.toHaveBeenCalled();
    });

    test("throws when delete fails", async () => {
      const repo = {
        findById: jest.fn().mockResolvedValue({ id: "c1" }),
        delete: jest.fn().mockResolvedValue(false),
      };
      const useCase = new DeleteCategory(repo);

      await expect(useCase.execute("c1")).rejects.toThrow(
        "Failed to delete category",
      );
      expect(repo.findById).toHaveBeenCalledWith("c1");
      expect(repo.delete).toHaveBeenCalledWith("c1");
    });

    test("returns success message when delete succeeds", async () => {
      const repo = {
        findById: jest.fn().mockResolvedValue({ id: "c1" }),
        delete: jest.fn().mockResolvedValue(true),
      };
      const useCase = new DeleteCategory(repo);

      const result = await useCase.execute("c1");

      expect(repo.findById).toHaveBeenCalledWith("c1");
      expect(repo.delete).toHaveBeenCalledWith("c1");
      expect(result).toEqual({ message: "Category deleted successfully" });
    });
  });
});

