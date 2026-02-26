const BookmarkSchema = require("../database/schemas/BookmarkSchema");

class BookmarkRepositoryImpl {
    async save(bookmark) {
        const newBookmark = new BookmarkSchema(bookmark);
        const saved = await newBookmark.save();
        return saved;
    }

    async findAll(){
        return (await BookmarkSchema.find()).sort({ createdAt: -1 });
    }

    async findById(id) {
        return await BookmarkSchema.findById(id);
    }

    async findByUserId(userId) {
        return await BookmarkSchema.find({ userId }).sort({ createdAt: -1 });
    }

    async findByMaterialId(materialId) {
        return await BookmarkSchema.find({ materialId }).sort({ createdAt: -1 });
    }

    async findByMaterialTitle(materialTitle) {
        return await BookmarkSchema.find({ materialTitle: { $regex: materialTitle, $options: 'i' } }).sort({ createdAt: -1 });
    }

    async update(id, data) {
        return await BookmarkSchema.findByIdAndUpdate(
            id, 
            { $set: data },
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return await BookmarkSchema.findByIdAndDelete(id);
    }
        
}

module.exports = BookmarkRepositoryImpl;
