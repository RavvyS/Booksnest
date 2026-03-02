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
        category: {
            type: String,
            trim: true,
        },
        author: {
            type: String,
            required: [true, "Author is required"],
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
