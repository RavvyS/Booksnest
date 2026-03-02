
//  Implements a single business use case with domain-focused rules.

class DeleteMaterial {

    constructor(repository) {
        this.repository = repository;
    }

    async execute({ id }) {
        const existing = await this.repository.findById(id);

        if (!existing) {
            throw new Error("Material not found");
        }

        await this.repository.delete(id);
        return { message: "Material deleted successfully" };
    }
}

module.exports = DeleteMaterial;
