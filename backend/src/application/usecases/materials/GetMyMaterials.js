//  Implements a single business use case with domain-focused rules.

class GetMyMaterials {
    constructor(repository) {
        this.repository = repository;
    }

    async execute({ userId, authorName }) {
        if (!userId) {
            throw new Error("User id is required");
        }

        return await this.repository.findByOwner({ userId, authorName });
    }
}

module.exports = GetMyMaterials;
