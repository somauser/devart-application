const User = require('../models/User');
const Art = require('../models/Art');

require('dotenv').config();
const fontAwesomeSrc = process.env.fontAwesomeAPI;

exports.getNew = async (req, res)=>{
    // console.log(user);
    res.render('arts/new', {fontAwesomeSrc})
}

exports.postArt = async (req, res, next)=>{
    // // access user info from session
    // const {title, location} = req.body;
    // const {name, price} = req.body;
    // const user = await User.findById(req.user._id);
    // const art = new Art({
    //     title, location
    // });
    // // add it to the user 
    // user.arts.push(art);
    // art.user = user;
    // await user.save();
    // await art.save();
    console.log(req.body, req.file);
    res.send('uploaded')
    // res.send(req.body);
}

exports.showArts = async (req, res)=>{
    const {id} = req.params 
    const art = await Art.findById(id).populate('user');
    res.render('arts/show', {art});
    // res.send(art)
}


// 'GET /arts'
exports.getIndex = async(req, res)=>{
    const arts = await Art.find({}).populate('user');
    res.render('arts/index', {arts});
    // res.send(arts[1].user.username)
}

// 6212ee4433f6875e8f4450d2