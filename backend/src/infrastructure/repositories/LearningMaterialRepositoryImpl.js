//  Implements persistence operations against MongoDB models.

const LearningMaterialRepository = require("../../domain/repositories/LearningMaterialRepository");
const LearningMaterialSchema = require("../database/schemas/LearningMaterialSchema");
const LearningMaterialEntity = require("../../domain/entities/LearningMaterial");

class LearningMaterialRepositoryImpl extends LearningMaterialRepository {

    _toEntity(doc) {
        if (!doc) return null;
        
        const catId = doc.categoryId && doc.categoryId._id 
          ? doc.categoryId._id.toString() 
          : (doc.categoryId ? doc.categoryId.toString() : null);
        
        const catName = (doc.categoryId && doc.categoryId.name) 
          ? doc.categoryId.name 
          : (doc.categoryName || doc.category || 'General');

        return new LearningMaterialEntity({
            id: doc._id.toString(),
            _id: doc._id.toString(), // Add this for frontend components using legacy _id
            title: doc.title,
            description: doc.description,
            contentUrl: doc.contentUrl,
            type: doc.type,
            category: doc.category,
            categoryId: catId,
            categoryName: catName,
            author: doc.author,
            createdBy: doc.createdBy,
            status: doc.status,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }

    async save(material) {
        const newMaterial = new LearningMaterialSchema({
            title: material.title,
            description: material.description,
            contentUrl: material.contentUrl,
            type: material.type,
            category: material.category,
            categoryId: material.categoryId || undefined,
            categoryName: material.categoryName,
            author: material.author,
            createdBy: material.createdBy,
            status: "pending"
        });
        const saved = await newMaterial.save();
        const populated = await LearningMaterialSchema.findById(saved._id).populate("categoryId");
        return this._toEntity(populated);
    }

    async findAllApproved() {
        const docs = await LearningMaterialSchema.find({ status: "approved" })
            .populate("categoryId")
            .sort({ createdAt: -1 });
        return docs.map(d => this._toEntity(d));
    }

    async findAllPending() {
        const docs = await LearningMaterialSchema.find({ status: "pending" })
            .populate("categoryId")
            .sort({ createdAt: -1 });
        return docs.map(d => this._toEntity(d));
    }

    async findAll() {
        const docs = await LearningMaterialSchema.find()
            .populate("categoryId")
            .sort({ createdAt: -1 });
        return docs.map(d => this._toEntity(d));
    }

    async findById(id) {
        const doc = await LearningMaterialSchema.findById(id).populate("categoryId");
        return this._toEntity(doc);
    }

    async findByCategory(category) {
        const docs = await LearningMaterialSchema.find({ status: "approved", category })
            .populate("categoryId")
            .sort({ createdAt: -1 });
        return docs.map(d => this._toEntity(d));
    }

    async findByCategoryId(categoryId) {
        const docs = await LearningMaterialSchema.find({ status: "approved", categoryId })
            .populate("categoryId")
            .sort({ createdAt: -1 });
        return docs.map(d => this._toEntity(d));
    }

    async findByOwner({ userId, authorName }) {
        const filters = [{ createdBy: userId }];
        if (authorName) {
            filters.push({ author: authorName });
        }
        const docs = await LearningMaterialSchema.find({ $or: filters })
            .populate("categoryId")
            .sort({ createdAt: -1 });
        return docs.map(d => this._toEntity(d));
    }

    async update(id, data) {
        const updated = await LearningMaterialSchema.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        ).populate("categoryId");
        return this._toEntity(updated);
    }

    async approve(id, status) {
        const updated = await LearningMaterialSchema.findByIdAndUpdate(
            id,
            { $set: { status } },
            { new: true, runValidators: true }
        ).populate("categoryId");
        return this._toEntity(updated);
    }

    async delete(id) {
        const deleted = await LearningMaterialSchema.findByIdAndDelete(id);
        return deleted !== null;
    }
}

module.exports = LearningMaterialRepositoryImpl;
