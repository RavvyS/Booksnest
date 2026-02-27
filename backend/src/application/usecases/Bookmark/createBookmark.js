
//  Implements a single business use case with domain-focused rules.

const Bookmark = require("../../../domain/entities/Bookmark");

class CreateBookmark {
    constructor({ bookmarkRepository }) {
        this.bookmarkRepository = bookmarkRepository;
    }

    async execute(data) {

        if (!data.materialId) {
            throw new Error("materialId is required");
        }

        if (!data.userId) {
            throw new Error("userId is required");
        }

        /*
        if (!data.title || !data.title.trim()) {
            throw new Error("Title is required");
        }

        if (!data.contentUrl || !data.contentUrl.trim()) {
            throw new Error("Content URL is required");
        }
        */
      
    

        const bookmark = new Bookmark({
            userId: data.userId,
            materialId: data.materialId,
            materialTitle: data.materialTitle,
            materialContentUrl: data.materialContentUrl,
            note: data.note.trim()
        });


        return await this.bookmarkRepository.save(bookmark);

    }

}

module.exports = CreateBookmark;