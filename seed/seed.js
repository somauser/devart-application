require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User')
const Art = require('../models/Art')
const Comment = require('../models/Comment');

const users = [
    '6212ee4433f6875e8f4450d2',
    '621690303c53ed30cb1fd5db',
    '62169082190a1a7ce23a7210'
]


// database connection
async function connect(){
    mongoose.connect(process.env.mongoURI);
}

connect().then(res=>console.log('DB connected'))
    .catch(err=>console.log(err));

async function main(){
    const arts = await Art.find({});
    console.log(arts);
}

main();
