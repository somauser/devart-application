const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// create a Schema for User 
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    arts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Art'
        }
    ]
});
// This will add Username nad password to the schema and some methods to use for authentication 
// username will be unique
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);