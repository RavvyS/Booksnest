//  Implements persistence operations against MongoDB models.

const LearningMaterialSchema = require("../database/schemas/LearningMaterialSchema");

class LearningMaterialRepositoryImpl {

    async save(material) {
        const newMaterial = new LearningMaterialSchema(material);
        const saved = await newMaterial.save();
        return saved;
    }

    async findAllApproved() {
        return await LearningMaterialSchema.find({ status: "approved" }).sort({ createdAt: -1 });
    }

    async findAllPending() {
        return await LearningMaterialSchema.find({ status: "pending" }).sort({ createdAt: -1 });
    }

    async findAll() {
        return await LearningMaterialSchema.find().sort({ createdAt: -1 });
    }

    async findById(id) {
        return await LearningMaterialSchema.findById(id);
    }

    async findByCategory(category) {
        return await LearningMaterialSchema.find({ status: "approved", category }).sort({ createdAt: -1 });
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
