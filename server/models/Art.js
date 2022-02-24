const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// location and key
const artSchema = new mongoose.Schema({
    title: String,
    imageURL: {
        url: String,
        filename: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    meta: {
        tags: [
            {type: String}
        ],
        votes: Number
    },
    description: {
        type: String,
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, { timestamps: true });

const Arts = mongoose.model('Art', artSchema);

module.exports = Arts;