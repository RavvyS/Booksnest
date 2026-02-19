const express = require('express');
const router = express.Router();

const {
    getLearningMaterials,
    createLearningMaterial,
    updateLearningMaterial,
    deleteLearningMaterial
} = require('../controllers/learningMaterialController');

router.route('/')
    .get(getLearningMaterials)
    .post(createLearningMaterial);

router.route('/:id')
    .put(updateLearningMaterial)
    .delete(deleteLearningMaterial);

module.exports = router;
