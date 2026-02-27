const mongoose = require("mongoose");

const BorrowSchema = new mongoose.Schema(
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
    borrowedAt: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    returned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for fast active-borrow lookups
BorrowSchema.index({ userId: 1, bookId: 1, returned: 1 });

module.exports = mongoose.model("Borrow", BorrowSchema);
