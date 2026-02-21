const LearningMaterial = require('../models/LearningMaterial');

// @desc    Get all learning materials
// @route   GET /materials
// @access  Public
exports.getLearningMaterials = async (req, res) => {
    try {
        const materials = await LearningMaterial.find();
        res.status(200).json({
            success: true,
            count: materials.length,
            data: materials
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Create new learning material
// @route   POST /materials
// @access  Private (Author)
exports.createLearningMaterial = async (req, res) => {
    try {
        const material = await LearningMaterial.create(req.body);

        res.status(201).json({
            success: true,
            data: material
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Update learning material
// @route   PUT /materials/:id
// @access  Private (Author/Librarian)
exports.updateLearningMaterial = async (req, res) => {
    try {
        let material = await LearningMaterial.findById(req.params.id);

        if (!material) {
            return res.status(404).json({
                success: false,
                error: 'Learning material not found'
            });
        }

        material = await LearningMaterial.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: material
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Delete learning material
// @route   DELETE /materials/:id
// @access  Private (Librarian/Author)
exports.deleteLearningMaterial = async (req, res) => {
    try {
        const material = await LearningMaterial.findById(req.params.id);

        if (!material) {
            return res.status(404).json({
                success: false,
                error: 'Learning material not found'
            });
        }

        await material.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Approve a learning material
// @route   PATCH /materials/:id/approve
// @access  Private (Librarian only)
exports.approveMaterial = async (req, res) => {
    try {
        let material = await LearningMaterial.findById(req.params.id);

        if (!material) {
            return res.status(404).json({
                success: false,
                error: 'Learning material not found'
            });
        }

        material = await LearningMaterial.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Material approved successfully',
            data: material
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};
