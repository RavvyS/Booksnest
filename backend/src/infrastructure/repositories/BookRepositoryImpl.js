//  Implements persistence operations against MongoDB models.

const BookRepository = require("../../domain/repositories/BookRepository");
const BookModel = require("../database/schemas/BookSchema");
const Book = require("../../domain/entities/Book");

class BookRepositoryImpl extends BookRepository {
  _toEntity(doc) {
    return new Book({
      id: doc._id.toString(),
      title: doc.title,
      author: doc.author,
      isbn: doc.isbn,
      categoryId: doc.categoryId ? doc.categoryId.toString() : null,
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
      categoryId: book.categoryId || undefined,
      description: book.description,
      filePath: book.filePath || null,
      totalCopies: book.totalCopies,
      availableCopies: book.totalCopies,
    });
    const saved = await newBook.save();
    return this._toEntity(saved);
  }

  async findAll() {
    const books = await BookModel.find().sort({ title: 1 });
    return books.map((b) => this._toEntity(b));
  }

  async findById(id) {
    const book = await BookModel.findById(id);
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
      categoryId: bookData.categoryId || undefined,
      description: bookData.description,
    };
    if (bookData.filePath !== undefined) {
      updateFields.filePath = bookData.filePath;
    }
    const updated = await BookModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true },
    );
    if (!updated) return null;
    return this._toEntity(updated);
  }

  /**
   * Returns the raw filePath for a book (for secure streaming).
   * Does NOT return a domain entity — only the path.
   */
  async getFilePath(bookId) {
    const book = await BookModel.findById(bookId).select("filePath");
    if (!book) return null;
    return book.filePath || null;
  }

  async delete(id) {
    const deleted = await BookModel.findByIdAndDelete(id);
    return deleted !== null;
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
