//  Implements a single business use case with domain-focused rules.

class GetAllMaterials {

    constructor(repository) {
        this.repository = repository;
    }

    async execute({ category, categoryId } = {}) {
        if (categoryId) {
            return await this.repository.findByCategoryId(categoryId);
        }
        if (category) {
            return await this.repository.findByCategory(category);
        }
        return await this.repository.findAllApproved();
    }
}

module.exports = GetAllMaterials;
