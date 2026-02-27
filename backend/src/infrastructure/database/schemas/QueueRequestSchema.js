//  Defines the Mongoose schema for this collection.

const mongoose = require("mongoose");

const QueueRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book ID is required"],
    },
    note: {
      type: String,
      trim: true,
      maxlength: [500, "Queue note cannot exceed 500 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "fulfilled", "cancelled"],
      default: "pending",
      index: true,
    },
    fulfilledBorrowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Borrow",
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    fulfilledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

QueueRequestSchema.index({ bookId: 1, status: 1, createdAt: 1 });
QueueRequestSchema.index(
  { userId: 1, bookId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "processing"] },
    },
  },
);

module.exports = mongoose.model("QueueRequest", QueueRequestSchema);
