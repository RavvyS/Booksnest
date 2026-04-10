
//  Implements a single business use case with domain-focused rules.

class DeleteBookmark {
    constructor(bookmarkRepository) {
        this.bookmarkRepository = bookmarkRepository;
    }

    async execute({ id, userId }) {
        const existingBookmark = await this.bookmarkRepository.findById(id);

        // Check if the bookmark exists
        if (!existingBookmark) {
            throw new Error("Bookmark not found");
        }

        // Ensure the user owns the bookmark
        if (existingBookmark.userId.toString() !== userId) {
            throw new Error("Unauthorized");
        }

        // Delete the bookmark
        await this.bookmarkRepository.delete(id);
        return { message: "Bookmark deleted successfully" };
    }

}

module.exports = DeleteBookmark;