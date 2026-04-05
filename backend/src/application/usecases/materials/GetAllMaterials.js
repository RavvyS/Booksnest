//  Implements a single business use case with domain-focused rules.

class GetAllMaterials {

    constructor(repository) {
        this.repository = repository;
    }

    async execute({ categoryId } = {}) {
        if (categoryId) {
            return await this.repository.findByCategory(categoryId);
        }
        return await this.repository.findAllApproved();
    }
}

module.exports = GetAllMaterials;
