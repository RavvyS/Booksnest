
//  Implements a single business use case with domain-focused rules.

class DeleteMaterial {

    constructor(repository) {
        this.repository = repository;
    }

    async execute({ id, userId, role }) {
        const existing = await this.repository.findById(id);

        if (!existing) {
            throw new Error("Material not found");
        }

        if (role !== "librarian" && existing.uploadedBy?.toString() !== userId?.toString()) {
            throw new Error("Unauthorized: You can only delete your own submissions");
        }

        await this.repository.delete(id);
        return { message: "Material deleted successfully" };
    }
}

module.exports = DeleteMaterial;
