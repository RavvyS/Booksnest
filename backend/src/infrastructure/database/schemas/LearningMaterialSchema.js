//  Defines the Mongoose schema for this collection.

const mongoose = require("mongoose");

const learningMaterialSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        contentUrl: {
            type: String,
            required: [true, "Content URL is required"],
            trim: true,
        },
        type: {
            type: String,
            enum: ["video", "audio"],
            required: [true, "Material type is required"],
        },
        category: {
            type: String,
            trim: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: false,
        },
        categoryName: {
            type: String,
            trim: true,
        },
        author: {
            type: String,
            required: [true, "Author is required"],
            trim: true,
        },
        createdBy: {
            type: String,
            required: [true, "Creator is required"],
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("LearningMaterial", learningMaterialSchema);
