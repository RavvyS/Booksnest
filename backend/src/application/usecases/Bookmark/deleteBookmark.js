class DeleteBookmark {
    constructor({ bookmarkRepository }) {
        this.bookmarkRepository = bookmarkRepository;
    }

    async execute({ bookmarkId, userId }) {
        const existingBookmark = await this.bookmarkRepository.findById(id); 

        // Check if the bookmark exists
        if (!existingBookmark) {
            throw new Error("Bookmark not found");
        }

        // Ensure the user owns the bookmark
        if (existingBookmark.userId !== userId) {
            throw new Error("Unauthorized");
        }

        // Delete the bookmark
        await this.bookmarkRepository.delete(bookmarkId);
        return { message: "Bookmark deleted successfully" };
    }

}

module.exports = DeleteBookmark;