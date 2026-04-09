//  Implements persistence operations against MongoDB models.

const LearningMaterialRepository = require("../../domain/repositories/LearningMaterialRepository");
const LearningMaterialSchema = require("../database/schemas/LearningMaterialSchema");

class LearningMaterialRepositoryImpl extends LearningMaterialRepository {
    _toEntity(doc) {
        if (!doc) return null;
        return {
            id: doc._id.toString(),
            title: doc.title,
            description: doc.description,
            author: doc.author,
            contentUrl: doc.contentUrl,
            type: doc.type,
            category: doc.category,
            status: doc.status,
            uploadedBy: doc.uploadedBy ? doc.uploadedBy.toString() : null,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }

    async save(material) {
        const newMaterial = new LearningMaterialSchema(material);
        const saved = await newMaterial.save();
        return this._toEntity(saved);
    }

    async findAllApproved() {
        const docs = await LearningMaterialSchema.find({ status: "approved" }).sort({ createdAt: -1 });
        return docs.map(d => this._toEntity(d));
    }

    async findAllPending() {
        const docs = await LearningMaterialSchema.find({ status: "pending" }).sort({ createdAt: -1 });
        return docs.map(d => this._toEntity(d));
    }

    async findAll() {
        const docs = await LearningMaterialSchema.find().sort({ createdAt: -1 });
        return docs.map(d => this._toEntity(d));
    }

    async findById(id) {
        const doc = await LearningMaterialSchema.findById(id);
        return this._toEntity(doc);
    }

    async findByCategory(category) {
        const docs = await LearningMaterialSchema.find({ status: "approved", category }).sort({ createdAt: -1 });
        return docs.map(d => this._toEntity(d));
    }


    async update(id, data) {
        const updated = await LearningMaterialSchema.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );
        return this._toEntity(updated);
    }

    async approve(id, status) {
        const updated = await LearningMaterialSchema.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true, runValidators: true }
        );
        return this._toEntity(updated);
    }

    async findByAuthorId(uploadedBy) {
        const docs = await LearningMaterialSchema.find({ uploadedBy }).sort({ createdAt: -1 });
        return docs.map(d => this._toEntity(d));
    }

    async delete(id) {
        const deleted = await LearningMaterialSchema.findByIdAndDelete(id);
        return deleted !== null;
    }
}

module.exports = LearningMaterialRepositoryImpl;
