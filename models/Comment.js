const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// location and key
const commentSchema = new mongoose.Schema({
    text: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    art: {
        type: Schema.Types.ObjectId,
        ref: 'Art'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;