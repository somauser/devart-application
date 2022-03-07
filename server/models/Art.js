const mongoose = require('mongoose');
const User = require('./User');
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


// run after running findOneAndDelete
// artSchema.post('findOneAndDelete', async function(doc){
//     console.log(doc);
//     console.log('Mongoose middleware triggered')
//     console.log(doc._id)
//     if(doc) {
//         console.log(doc)
//         await User.findByIdAndUpdate(doc.user._id, {
//             "$pull" : {
//                 arts: {
//                     "_id" : new ObjectId("6225aabc3f29f4b9d5bd5610")
//                 }
//             } 
//         }, {new: true});
//     }
// })


const Arts = mongoose.model('Art', artSchema);


module.exports = Arts;