class GetAllMaterials {

    constructor(repository) {
        this.repository = repository;
    }

    async execute({ category } = {}) {
        if (category) {
            return await this.repository.findByCategory(category);
        }
        return await this.repository.findAllApproved();
    }
}

module.exports = GetAllMaterials;
