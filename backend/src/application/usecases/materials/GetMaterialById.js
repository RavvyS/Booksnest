
//  Implements a single business use case with domain-focused rules.

class GetMaterialById {

    constructor(repository) {
        this.repository = repository;
    }

    async execute({ id }) {
        const material = await this.repository.findById(id);

        if (!material) {
            throw new Error("Material not found");
        }

        return material;
    }
}

module.exports = GetMaterialById;
