
//  Represents a core domain entity used by application logic.

class Bookmark {
    constructor({ id, userId, materialId, materialTitle, materialContentUrl, note, createdAt}) {
        this.id = id;
        this.userId = userId;
        this.materialId = materialId;
        this.materialTitle = materialTitle;
        this.materialContentUrl = materialContentUrl;
        this.note = note;
        this.createdAt = createdAt || new Date();
    }
}

module.exports = Bookmark;