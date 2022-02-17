const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const artSchema = new mongoose.Schema({
    title: String,
    price: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Arts = mongoose.model('Art', artSchema);

module.exports = Arts;