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
        author: {
            type: String,
            required: [true, "Author name is required"],
            trim: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Uploader ID is required"],
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
