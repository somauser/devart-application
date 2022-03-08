const User = require('../models/User');
const Art = require('../models/Art');
const Comment = require('../models/Comment');

require('dotenv').config();
const fontAwesomeSrc = process.env.fontAwesomeAPI;

exports.getNew = async (req, res)=>{
    // console.log(user);
    res.render('arts/new', {fontAwesomeSrc})
}

exports.postArt = async (req, res, next)=>{
    // access user info from session
    const {title, description, tags} = req.body;
    // const {name, price} = req.body;
    const user = await User.findById(req.user._id);
    const art = new Art({
        title,
        description,
    });
    // tags is an array with object containing value key
    console.log(req.body);
    art.imageURL.url = req.file.location,
    art.imageURL.filename = req.file.key
    // add it to the user 
    user.arts.push(art);
    art.user = user;
    // adding tags to tags
    tags.forEach((tag)=>{
        console.log(tag.value);
    })
    await user.save();
    await art.save();
    // console.log(req.body, req.file);
    // console.log(art);
    res.redirect(`/arts/${art._id}`);
    // res.send(req.body);
}

exports.showArts = async (req, res)=>{
    try {
        const {id} = req.params 
        const art = await Art.findById(id).populate('user').populate('comments');
        const comments = await Comment.find({art: art}).populate('user');
        // get arts by user 
        // const arts = await Art.find({user: req.user.username});
        const user = await User.findById(art.user._id).populate('arts');
        // console.log(user.arts)
        // console.log(await art.comments[0].populate('user'))
        console.log(comments);
        res.render('arts/show', {art, arts: user.arts, comments});
    } catch(err){
        res.render('500').status(500);
    }

    // res.send(art)
}

// 'GET /arts'
exports.getIndex = async(req, res)=>{
    const arts = await Art.find({}).populate('user').sort({_id:-1}).limit(6);
    res.render('arts/index', {arts});
    // res.send(arts[1].user.username)
}


// 6212ee4433f6875e8f4450d2