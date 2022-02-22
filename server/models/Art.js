const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const artSchema = new mongoose.Schema({
    title: String,
    location: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Arts = mongoose.model('Art', artSchema);

module.exports = Arts;