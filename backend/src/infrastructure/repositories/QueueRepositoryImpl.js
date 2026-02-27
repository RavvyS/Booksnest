const QueueRepository = require("../../domain/repositories/QueueRepository");
const QueueRequestModel = require("../database/schemas/QueueRequestSchema");
const QueueRequest = require("../../domain/entities/QueueRequest");

class QueueRepositoryImpl extends QueueRepository {
  _toEntity(doc) {
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
    const requests = await QueueRequestModel.find({ userId }).sort({
      createdAt: -1,
    });
    return requests.map((req) => this._toEntity(req));
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
      { new: true, runValidators: true },
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
      { new: true, runValidators: true },
    );
    if (!updated) return null;
    return this._toEntity(updated);
  }

  async claimNextPending(bookId, session = null) {
    const opts = session
      ? { session, sort: { createdAt: 1 }, new: true }
      : { sort: { createdAt: 1 }, new: true };

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
      ? { session, new: true, runValidators: true }
      : { new: true, runValidators: true };

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
      ? { session, new: true, runValidators: true }
      : { new: true, runValidators: true };

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
      ? { session, new: true, runValidators: true }
      : { new: true, runValidators: true };

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
}

module.exports = QueueRepositoryImpl;
