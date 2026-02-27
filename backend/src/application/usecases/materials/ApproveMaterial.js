class ApproveMaterial {

    constructor(repository) {
        this.repository = repository;
    }

    async execute({ id, status }) {
        const validStatuses = ["approved", "rejected"];

        if (!status || !validStatuses.includes(status)) {
            throw new Error("Status must be 'approved' or 'rejected'");
        }

        const existing = await this.repository.findById(id);

        if (!existing) {
            throw new Error("Material not found");
        }

        const updated = await this.repository.approve(id, status);
        return updated;
    }
}

module.exports = ApproveMaterial;
