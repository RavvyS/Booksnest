const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      minlength: [1, "Book title must be at least 1 character"],
      maxlength: [300, "Book title cannot exceed 300 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: [200, "Author name cannot exceed 200 characters"],
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    filePath: {
      type: String,
      default: null,
    },
    totalCopies: {
      type: Number,
      required: [true, "Total copies is required"],
      min: [0, "Total copies cannot be negative"],
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      min: [0, "Available copies cannot be negative"],
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Book", BookSchema);
