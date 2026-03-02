
//  Implements a single business use case with domain-focused rules.

const LearningMaterial = require("../../../domain/entities/LearningMaterial");

class CreateMaterial {

    constructor(repository) {
        this.repository = repository;
    }

    async execute(data) {
        if (!data.title || !data.title.trim()) {
            throw new Error("Title is required");
        }

        if (!data.contentUrl || !data.contentUrl.trim()) {
            throw new Error("Content URL is required");
        }

        if (!data.author || !data.author.trim()) {
            throw new Error("Author is required");
        }

        const material = new LearningMaterial({
            title: data.title.trim(),
            description: data.description || "",
            contentUrl: data.contentUrl.trim(),
            category: data.category || "",
            author: data.author.trim(),
            status: "pending",
        });

        return await this.repository.save(material);
    }
}

module.exports = CreateMaterial;
