
//  Defines the Mongoose schema for this collection.

const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        materialId: {
            //type: mongoose.Schema.Types.ObjectId,
            type: String,
            ref: 'Material',
            required: true,
            index: true
        },
        materialTitle: {
            type: String,
            required: true,
            //ref: 'Material'
        },
        materialContentUrl: {   
            type: String,
            required: true,
            //ref: 'Material'
        },
        note: {
            type: String,   
            required: false,
            trim: true
        }
    },


    {
        timestamps: true
    }
);


module.exports = mongoose.model('Bookmark', bookmarkSchema);