class GetPendingMaterials {

    constructor(repository) {
        this.repository = repository;
    }

    async execute() {
        return await this.repository.findAllPending();
    }
}

module.exports = GetPendingMaterials;
