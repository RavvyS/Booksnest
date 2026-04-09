
//  Implements a single business use case to fetch materials by uploader ID.

class GetMyMaterials {
    constructor(repository) {
        this.repository = repository;
    }

    async execute(authorId) {
        if (!authorId) {
            throw new Error("Author ID is required");
        }
        return await this.repository.findByAuthorId(authorId);
    }
}

module.exports = GetMyMaterials;
