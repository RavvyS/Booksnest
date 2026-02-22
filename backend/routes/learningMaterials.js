const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const {
    getLearningMaterials,
    createLearningMaterial,
    updateLearningMaterial,
    deleteLearningMaterial,
    approveMaterial
} = require('../controllers/learningMaterialController');

// Public: anyone can view materials
router.get('/', getLearningMaterials);

// Protected: only logged-in authors can create
router.post('/', protect, authorizeRoles('author'), createLearningMaterial);

// Protected: author or librarian can update
router.put('/:id', protect, authorizeRoles('author', 'librarian'), updateLearningMaterial);

// Protected: only librarian can delete
router.delete('/:id', protect, authorizeRoles('librarian'), deleteLearningMaterial);

// Protected: only librarian can approve
router.patch('/:id/approve', protect, authorizeRoles('librarian'), approveMaterial);

module.exports = router;
