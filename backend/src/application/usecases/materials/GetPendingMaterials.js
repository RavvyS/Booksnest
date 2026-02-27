
//  Implements a single business use case with domain-focused rules.

class GetPendingMaterials {

    constructor(repository) {
        this.repository = repository;
    }

    async execute() {
        return await this.repository.findAllPending();
    }
}

module.exports = GetPendingMaterials;
