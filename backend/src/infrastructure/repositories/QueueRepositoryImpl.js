//  Implements persistence operations against MongoDB models.

const mongoose = require("mongoose");
const QueueRepository = require("../../domain/repositories/QueueRepository");
const QueueRequestModel = require("../database/schemas/QueueRequestSchema");
const QueueRequest = require("../../domain/entities/QueueRequest");

class QueueRepositoryImpl extends QueueRepository {
  _toEntity(doc) {
    if (!doc) return null;
    return new QueueRequest({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      bookId: doc.bookId.toString(),
      note: doc.note,
      status: doc.status,
      fulfilledBorrowId: doc.fulfilledBorrowId
        ? doc.fulfilledBorrowId.toString()
        : null,
      cancellationReason: doc.cancellationReason,
      cancelledAt: doc.cancelledAt,
      fulfilledAt: doc.fulfilledAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(queueData, session = null) {
    const newRequest = new QueueRequestModel({
      userId: queueData.userId,
      bookId: queueData.bookId,
      note: queueData.note || "",
      status: "pending",
    });

    const opts = session ? { session } : {};
    const saved = await newRequest.save(opts);
    return this._toEntity(saved);
  }

  async findById(id) {
    const request = await QueueRequestModel.findById(id);
    if (!request) return null;
    return this._toEntity(request);
  }

  async findByUser(userId) {
    // Aggregation to join with books collection for title/author
    const requests = await QueueRequestModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },
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
          note: 1,
          status: 1,
          fulfilledBorrowId: 1,
          cancellationReason: 1,
          cancelledAt: 1,
          fulfilledAt: 1,
          createdAt: 1,
          updatedAt: 1,
          bookTitle: "$bookDetails.title",
          bookAuthor: "$bookDetails.author",
        },
      },
    ]);

    return requests.map((req) => ({
      ...this._toEntity(req),
      bookTitle: req.bookTitle,
      bookAuthor: req.bookAuthor,
    }));
  }

  async findActiveRequestByUserAndBook(userId, bookId) {
    const request = await QueueRequestModel.findOne({
      userId,
      bookId,
      status: { $in: ["pending", "processing"] },
    });
    if (!request) return null;
    return this._toEntity(request);
  }

  async updatePendingByIdAndUser(requestId, userId, updateData) {
    const updated = await QueueRequestModel.findOneAndUpdate(
      {
        _id: requestId,
        userId,
        status: "pending",
      },
      { $set: updateData },
      { returnDocument: 'after', runValidators: true },
    );
    if (!updated) return null;
    return this._toEntity(updated);
  }

  async cancelPendingByIdAndUser(requestId, userId) {
    const updated = await QueueRequestModel.findOneAndUpdate(
      {
        _id: requestId,
        userId,
        status: "pending",
      },
      {
        $set: {
          status: "cancelled",
          cancellationReason: "Cancelled by user",
          cancelledAt: new Date(),
        },
      },
      { returnDocument: 'after', runValidators: true },
    );
    if (!updated) return null;
    return this._toEntity(updated);
  }

  async claimNextPending(bookId, session = null) {
    const opts = session
      ? { session, sort: { createdAt: 1 }, returnDocument: 'after' }
      : { sort: { createdAt: 1 }, returnDocument: 'after' };

    const claimed = await QueueRequestModel.findOneAndUpdate(
      {
        bookId,
        status: "pending",
      },
      {
        $set: {
          status: "processing",
        },
      },
      opts,
    );

    if (!claimed) return null;
    return this._toEntity(claimed);
  }

  async markFulfilled(requestId, borrowId, session = null) {
    const opts = session
      ? { session, returnDocument: 'after', runValidators: true }
      : { returnDocument: 'after', runValidators: true };

    const updated = await QueueRequestModel.findByIdAndUpdate(
      requestId,
      {
        $set: {
          status: "fulfilled",
          fulfilledBorrowId: borrowId,
          fulfilledAt: new Date(),
        },
      },
      opts,
    );

    if (!updated) return null;
    return this._toEntity(updated);
  }

  async markCancelledBySystem(requestId, reason, session = null) {
    const opts = session
      ? { session, returnDocument: 'after', runValidators: true }
      : { returnDocument: 'after', runValidators: true };

    const updated = await QueueRequestModel.findByIdAndUpdate(
      requestId,
      {
        $set: {
          status: "cancelled",
          cancellationReason: reason || "Cancelled by system",
          cancelledAt: new Date(),
        },
      },
      opts,
    );

    if (!updated) return null;
    return this._toEntity(updated);
  }

  async releaseToPending(requestId, session = null) {
    const opts = session
      ? { session, returnDocument: 'after', runValidators: true }
      : { returnDocument: 'after', runValidators: true };

    const updated = await QueueRequestModel.findByIdAndUpdate(
      requestId,
      {
        $set: {
          status: "pending",
        },
      },
      opts,
    );

    if (!updated) return null;
    return this._toEntity(updated);
  }

  async findActiveByBook(bookId) {
    const requests = await QueueRequestModel.aggregate([
      {
        $match: {
          bookId: new mongoose.Types.ObjectId(bookId),
          status: { $in: ["pending", "processing"] },
        },
      },
      { $sort: { createdAt: 1 } }, // FIFO order
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 1,
          userId: 1,
          bookId: 1,
          note: 1,
          status: 1,
          createdAt: 1,
          userName: "$userDetails.name",
          userEmail: "$userDetails.email",
        },
      },
    ]);

    return requests.map((req) => ({
      ...this._toEntity(req),
      userName: req.userName,
      userEmail: req.userEmail,
    }));
  }

  async cancelByLibrarian(requestId) {
    const updated = await QueueRequestModel.findByIdAndUpdate(
      requestId,
      {
        $set: {
          status: "cancelled",
          cancellationReason: "Removed by librarian",
          cancelledAt: new Date(),
        },
      },
      { returnDocument: 'after', runValidators: true },
    );
    if (!updated) return null;
    return this._toEntity(updated);
  }

  async getUserPosition(bookId, userId) {
    const userRequest = await QueueRequestModel.findOne({
      userId,
      bookId,
      status: { $in: ["pending", "processing"] },
    });

    if (!userRequest) return null;

    const countAhead = await QueueRequestModel.countDocuments({
      bookId,
      status: "pending",
      createdAt: { $lt: userRequest.createdAt },
    });

    const totalWaiting = await QueueRequestModel.countDocuments({
      bookId,
      status: { $in: ["pending", "processing"] },
    });

    return {
      position: countAhead + 1,
      totalWaiting,
      status: userRequest.status,
    };
  }
}

module.exports = QueueRepositoryImpl;
