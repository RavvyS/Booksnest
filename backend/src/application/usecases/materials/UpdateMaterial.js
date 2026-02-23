class UpdateMaterial {

    constructor(repository) {
        this.repository = repository;
    }

    async execute({ id, data }) {
        const existing = await this.repository.findById(id);

        if (!existing) {
            throw new Error("Material not found");
        }

        // Do not allow status changes via update endpoint
        delete data.status;

        const updated = await this.repository.update(id, data);
        return updated;
    }
}

module.exports = UpdateMaterial;
