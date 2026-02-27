//  Implements persistence operations against MongoDB models.

const BorrowRepository = require("../../domain/repositories/BorrowRepository");
const BorrowModel = require("../database/schemas/BorrowSchema");
const Borrow = require("../../domain/entities/Borrow");

class BorrowRepositoryImpl extends BorrowRepository {
  _toEntity(doc) {
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

  async markReturned(borrowId, session = null) {
    const opts = session
      ? { session, new: true, runValidators: true }
      : { new: true, runValidators: true };
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
    const borrows = await BorrowModel.find({ userId }).sort({
      borrowedAt: -1,
    });
    return borrows.map((b) => this._toEntity(b));
  }

  async findByBook(bookId) {
    const borrows = await BorrowModel.find({ bookId }).sort({
      borrowedAt: -1,
    });
    return borrows.map((b) => this._toEntity(b));
  }
}

module.exports = BorrowRepositoryImpl;
