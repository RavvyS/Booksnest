//  Implements persistence operations against MongoDB models.

const path = require("path");
const mongoose = require("mongoose");
const BookRepository = require("../../domain/repositories/BookRepository");
const BookModel = require("../database/schemas/BookSchema");
const Book = require("../../domain/entities/Book");

class BookRepositoryImpl extends BookRepository {
  _toEntity(doc) {
    // categoryId might be an ID string/ObjectId or a populated object
    const catId = doc.categoryId && doc.categoryId._id 
      ? doc.categoryId._id.toString() 
      : (doc.categoryId ? doc.categoryId.toString() : null);
    
    // Fallback order: Populated Name > Legacy Category String > null
    const catName = (doc.categoryId && doc.categoryId.name) 
      ? doc.categoryId.name 
      : (doc.category || null);

    return new Book({
      id: doc._id.toString(),
      title: doc.title,
      author: doc.author,
      isbn: doc.isbn,
      type: doc.type,
      status: doc.status,
      uploadedBy: doc.uploadedBy ? doc.uploadedBy.toString() : null,
      categoryId: catId,
      categoryName: catName, // Add this for easier frontend access
      description: doc.description,
      filePath: doc.filePath || null,
      totalCopies: doc.totalCopies,
      availableCopies: doc.availableCopies,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(book) {
    const newBook = new BookModel({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      type: book.type,
      status: book.status || "pending",
      uploadedBy: book.uploadedBy,
      categoryId: book.categoryId || undefined,
      description: book.description,
      filePath: (book.filePath && book.filePath.includes("uploads")) 
        ? "uploads/" + book.filePath.split("uploads")[1].replace(/\\/g, "/").replace(/^\//, "")
        : (book.filePath || null),
      totalCopies: book.totalCopies,
      availableCopies: book.totalCopies,
    });
    const saved = await newBook.save();
    const populated = await BookModel.findById(saved._id).populate("categoryId");
    return this._toEntity(populated);
  }

  async findAll() {
    return await this.findAllApproved();
  }

  async findAllApproved() {
    const books = await BookModel.find({ status: "approved" })
      .populate("categoryId")
      .sort({ title: 1 });
    return books.map((b) => this._toEntity(b));
  }

  async findAllPending() {
    const books = await BookModel.find({ status: "pending" })
      .populate("categoryId")
      .sort({ createdAt: -1 });
    return books.map((b) => this._toEntity(b));
  }

  async findByUploader(userId) {
    const books = await BookModel.find({ uploadedBy: userId })
      .populate("categoryId")
      .sort({ createdAt: -1 });
    return books.map((b) => this._toEntity(b));
  }

  async approve(id, status) {
    const updated = await BookModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true },
    );
    if (!updated) return null;
    return this._toEntity(updated);
  }

  async findById(id) {
    const book = await BookModel.findById(id).populate("categoryId");
    if (!book) return null;
    return this._toEntity(book);
  }

  async findByIsbn(isbn) {
    const book = await BookModel.findOne({ isbn });
    if (!book) return null;
    return this._toEntity(book);
  }

  async update(id, bookData) {
    const updateFields = {
      title: bookData.title,
      author: bookData.author,
      isbn: bookData.isbn,
      categoryId: bookData.categoryId === "" ? null : (bookData.categoryId || undefined),
      description: bookData.description,
    };
    if (bookData.totalCopies !== undefined) {
      updateFields.totalCopies = bookData.totalCopies;
    }
    if (bookData.availableCopies !== undefined) {
      updateFields.availableCopies = bookData.availableCopies;
    }
    if (bookData.filePath !== undefined) {
      const pathValue = bookData.filePath;
      updateFields.filePath = (pathValue && pathValue.includes("uploads"))
        ? "uploads/" + pathValue.split("uploads")[1].replace(/\\/g, "/").replace(/^\//, "")
        : (pathValue || null);
    }
    const updated = await BookModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true },
    ).populate("categoryId");
    
    if (!updated) return null;
    return this._toEntity(updated);
  }

  /**
   * Returns the absolute filePath for a book (for secure streaming).
   */
  async getFilePath(bookId) {
    const book = await BookModel.findById(bookId).select("filePath");
    if (!book || !book.filePath) return null;

    // Resolve relative paths to absolute ones
    if (!path.isAbsolute(book.filePath)) {
      return path.join(process.cwd(), book.filePath);
    }
    return book.filePath;
  }

  async delete(id) {
    const deleted = await BookModel.findByIdAndDelete(id);
    return deleted !== null;
  }

  /**
   * Unsets categoryId for all books in a specific category.
   * Used when a category is deleted to maintain data integrity.
   */
  async removeCategoryFromBooks(categoryId) {
    return await BookModel.updateMany(
      { categoryId },
      { $set: { categoryId: null } },
    );
  }

  /**
   * Atomically decrement availableCopies by 1.
   * Only succeeds if availableCopies > 0.
   * Returns the updated book, or null if no copies available.
   */
  async atomicDecrementStock(bookId, session = null) {
    const opts = session ? { session, new: true } : { new: true };
    const updated = await BookModel.findOneAndUpdate(
      { _id: bookId, availableCopies: { $gt: 0 } },
      { $inc: { availableCopies: -1 } },
      opts,
    );
    if (!updated) return null;
    return this._toEntity(updated);
  }

  /**
   * Atomically increment availableCopies by 1.
   * Only succeeds if availableCopies < totalCopies.
   * Returns the updated book, or null if already at max.
   */
  async atomicIncrementStock(bookId, session = null) {
    const opts = session ? { session, new: true } : { new: true };
    const updated = await BookModel.findOneAndUpdate(
      {
        _id: bookId,
        $expr: { $lt: ["$availableCopies", "$totalCopies"] },
      },
      { $inc: { availableCopies: 1 } },
      opts,
    );
    if (!updated) return null;
    return this._toEntity(updated);
  }
}

module.exports = BookRepositoryImpl;
