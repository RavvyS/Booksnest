
//  Represents a core domain entity used by application logic.

class Bookmark {
    constructor({ id, userId, materialId, materialTitle, materialContentUrl, category, type, note, isFavorite, isCompleted, lastViewed, createdAt}) {
        this.id = id;
        this.userId = userId;
        this.materialId = materialId;
        this.materialTitle = materialTitle;
        this.materialContentUrl = materialContentUrl;
        this.category = category || null;
        this.type = type || 'material'; // 'book' | 'material'
        this.note = note;
        this.isFavorite = isFavorite || false;
        this.isCompleted = isCompleted || false;
        this.lastViewed = lastViewed || null;
        this.createdAt = createdAt || new Date();
    }
}

module.exports = Bookmark;