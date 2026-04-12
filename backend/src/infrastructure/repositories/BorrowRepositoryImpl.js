//  Implements persistence operations against MongoDB models.

const mongoose = require("mongoose");
const BorrowRepository = require("../../domain/repositories/BorrowRepository");
const BorrowModel = require("../database/schemas/BorrowSchema");
const BookModel = require("../database/schemas/BookSchema");
const Borrow = require("../../domain/entities/Borrow");

class BorrowRepositoryImpl extends BorrowRepository {
  _toEntity(doc) {
    if (!doc) return null;
    return new Borrow({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      bookId: doc.bookId.toString(),
      borrowedAt: doc.borrowedAt,
      dueDate: doc.dueDate,
      returnedAt: doc.returnedAt,
      returned: doc.returned,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(borrowData, session = null) {
    const newBorrow = new BorrowModel({
      userId: borrowData.userId,
      bookId: borrowData.bookId,
      borrowedAt: borrowData.borrowedAt,
      dueDate: borrowData.dueDate,
      returned: false,
    });
    const opts = session ? { session } : {};
    const saved = await newBorrow.save(opts);
    return this._toEntity(saved);
  }

  async findActiveBorrow(userId, bookId) {
    const borrow = await BorrowModel.findOne({
      userId,
      bookId,
      returned: false,
    });
    if (!borrow) return null;
    return this._toEntity(borrow);
  }

  async findValidBorrow(userId, bookId) {
    const borrow = await BorrowModel.findOne({
      userId,
      bookId,
      returned: false,
      dueDate: { $gt: new Date() },
    });
    if (!borrow) return null;
    return this._toEntity(borrow);
  }

  async returnExpiredBooks() {
    const now = new Date();
    // 1. Find all active borrows that are expired
    const expiredBorrows = await BorrowModel.find({
      returned: false,
      dueDate: { $lte: now },
    });

    if (expiredBorrows.length === 0) return 0;

    // 2. For each expired borrow, mark as returned and increment book stock
    let returnedCount = 0;
    for (const borrow of expiredBorrows) {
      // Use a session if available for atomicity, but bulk operations here are simpler
      const updated = await BorrowModel.findByIdAndUpdate(borrow._id, {
        returned: true,
        returnedAt: now,
      });

      if (updated) {
        await BookModel.findByIdAndUpdate(borrow.bookId, {
          $inc: { availableCopies: 1 },
        });
        returnedCount++;
      }
    }
    return returnedCount;
  }

  async markReturned(borrowId, session = null) {
    const opts = session
      ? { session, returnDocument: 'after', runValidators: true }
      : { returnDocument: 'after', runValidators: true };
    const updated = await BorrowModel.findByIdAndUpdate(
      borrowId,
      {
        returned: true,
        returnedAt: new Date(),
      },
      opts,
    );
    if (!updated) return null;
    return this._toEntity(updated);
  }

  async findByUser(userId) {
    // We use aggregation to join with the books collection for title/author
    const borrows = await BorrowModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $sort: { borrowedAt: -1 } },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: 1,
          userId: 1,
          bookId: 1,
          borrowedAt: 1,
          dueDate: 1,
          returnedAt: 1,
          returned: 1,
          createdAt: 1,
          updatedAt: 1,
          bookTitle: "$bookDetails.title",
          bookAuthor: "$bookDetails.author",
          filePath: "$bookDetails.filePath",
        },
      },
    ]);

    return borrows.map((b) => ({
      ...this._toEntity(b),
      bookTitle: b.bookTitle,
      bookAuthor: b.bookAuthor,
      filePath: b.filePath,
    }));
  }

  async findByBook(bookId) {
    const borrows = await BorrowModel.find({ bookId }).sort({
      borrowedAt: -1,
    });
    return borrows.map((b) => this._toEntity(b));
  }
}

module.exports = BorrowRepositoryImpl;
