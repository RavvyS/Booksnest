
//  Implements a single business use case with domain-focused rules.

class UpdateMaterial {

    constructor(repository) {
        this.repository = repository;
    }

    async execute({ id, data, userId, role }) {
        const existing = await this.repository.findById(id);

        if (!existing) {
            throw new Error("Material not found");
        }

        // Do not allow status changes via update endpoint
        delete data.status;

        if (role !== "librarian" && existing.uploadedBy?.toString() !== userId?.toString()) {
            throw new Error("Unauthorized: You can only edit your own submissions");
        }

        const updated = await this.repository.update(id, data);
        return updated;
    }
}

module.exports = UpdateMaterial;
