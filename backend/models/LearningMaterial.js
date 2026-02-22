const mongoose = require('mongoose');

const learningMaterialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    contentUrl: {
        type: String,
        required: [true, 'Please add content URL']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    author: {
        type: String,
        required: [true, 'Please add an author']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LearningMaterial', learningMaterialSchema);
