//  Implements persistence operations against MongoDB models.

const LearningMaterialRepository = require("../../domain/repositories/LearningMaterialRepository");
const LearningMaterialSchema = require("../database/schemas/LearningMaterialSchema");
const mongoose = require("mongoose");

class LearningMaterialRepositoryImpl extends LearningMaterialRepository {

    async save(material) {
        const newMaterial = new LearningMaterialSchema(material);
        const saved = await newMaterial.save();
        return saved;
    }

    async findAllApproved() {
        return await LearningMaterialSchema.find({ status: "approved" }).populate("categoryId").sort({ createdAt: -1 });
    }

    async findAllPending() {
        return await LearningMaterialSchema.find({ status: "pending" }).populate("categoryId").sort({ createdAt: -1 });
    }

    async findAll() {
        return await LearningMaterialSchema.find().populate("categoryId").sort({ createdAt: -1 });
    }

    async findById(id) {
        return await LearningMaterialSchema.findById(id).populate("categoryId");
    }

    async findByCategory(categoryId) {
        let filter = { status: "approved" };
        if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
            filter.categoryId = new mongoose.Types.ObjectId(categoryId);
        }
        return await LearningMaterialSchema.find(filter).populate("categoryId").sort({ createdAt: -1 });
    }

    async update(id, data) {
        return await LearningMaterialSchema.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );
    }

    async approve(id, status) {
        return await LearningMaterialSchema.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return await LearningMaterialSchema.findByIdAndDelete(id);
    }
}

module.exports = LearningMaterialRepositoryImpl;
