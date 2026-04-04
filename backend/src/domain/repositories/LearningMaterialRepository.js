
//  Declares repository contract methods expected by the domain layer.

class LearningMaterialRepository {
    async save(material) {
        throw new Error("Method not implemented");
    }

    async findAll() {
        throw new Error("Method not implemented");
    }

    async findAllApproved() {
        throw new Error("Method not implemented");
    }

    async findAllPending() {
        throw new Error("Method not implemented");
    }

    async findById(id) {
        throw new Error("Method not implemented");
    }

    async findByCategory(category) {
        throw new Error("Method not implemented");
    }

    async update(id, data) {
        throw new Error("Method not implemented");
    }

    async approve(id, status) {
        throw new Error("Method not implemented");
    }

    async delete(id) {
        throw new Error("Method not implemented");
    }
}

module.exports = LearningMaterialRepository;
