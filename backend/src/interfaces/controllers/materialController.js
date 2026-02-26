const LearningMaterialRepositoryImpl = require("../../infrastructure/repositories/LearningMaterialRepositoryImpl");
const CreateMaterial = require("../../application/usecases/materials/CreateMaterial");
const GetAllMaterials = require("../../application/usecases/materials/GetAllMaterials");
const GetMaterialById = require("../../application/usecases/materials/GetMaterialById");
const UpdateMaterial = require("../../application/usecases/materials/UpdateMaterial");
const DeleteMaterial = require("../../application/usecases/materials/DeleteMaterial");
const ApproveMaterial = require("../../application/usecases/materials/ApproveMaterial");
const GetPendingMaterials = require("../../application/usecases/materials/GetPendingMaterials");

const repository = new LearningMaterialRepositoryImpl();
const createUseCase = new CreateMaterial(repository);
const getAllUseCase = new GetAllMaterials(repository);
const getByIdUseCase = new GetMaterialById(repository);
const updateUseCase = new UpdateMaterial(repository);
const deleteUseCase = new DeleteMaterial(repository);
const approveUseCase = new ApproveMaterial(repository);
const getPendingUseCase = new GetPendingMaterials(repository);

// POST /api/materials
exports.createMaterial = async (req, res) => {
    try {
        const result = await createUseCase.execute({
            title: req.body.title,
            description: req.body.description,
            contentUrl: req.body.contentUrl,
            category: req.body.category,
            author: req.body.author,
        });

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET /api/materials
exports.getAllMaterials = async (req, res) => {
    try {
        const result = await getAllUseCase.execute({
            category: req.query.category,
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/materials/:id
exports.getMaterialById = async (req, res) => {
    try {
        const result = await getByIdUseCase.execute({ id: req.params.id });

        res.status(200).json(result);
    } catch (error) {
        const status = error.message === "Material not found" ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};

// PUT /api/materials/:id
exports.updateMaterial = async (req, res) => {
    try {
        const result = await updateUseCase.execute({
            id: req.params.id,
            data: req.body,
        });

        res.status(200).json(result);
    } catch (error) {
        const status = error.message === "Material not found" ? 404 : 400;
        res.status(status).json({ message: error.message });
    }
};

// DELETE /api/materials/:id
exports.deleteMaterial = async (req, res) => {
    try {
        const result = await deleteUseCase.execute({ id: req.params.id });

        res.status(200).json(result);
    } catch (error) {
        const status = error.message === "Material not found" ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};

// PATCH /api/materials/:id/approve
exports.approveMaterial = async (req, res) => {
    try {
        const result = await approveUseCase.execute({
            id: req.params.id,
            status: req.body.status,
        });

        res.status(200).json(result);
    } catch (error) {
        const status = error.message === "Material not found" ? 404 : 400;
        res.status(status).json({ message: error.message });
    }
};

// GET /api/materials/pending (librarian view)
exports.getPendingMaterials = async (req, res) => {
    try {
        const result = await getPendingUseCase.execute();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
