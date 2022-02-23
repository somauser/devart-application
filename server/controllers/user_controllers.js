require('dotenv').config();
const User = require('../models/User')

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]
const fontAwesomeSrc = process.env.fontAwesomeAPI;

exports.getHome = async (req, res)=>{
    const {user} = req.params;
    res.send(`Welcome home ${user}`);
}

exports.getNew = async(req,res )=>{
    res.render('users/new', {months, fontAwesomeSrc})
}

exports.createUser = async(req, res)=>{
    try {
        const {email, username, password} = req.body;
        const user = new User({
            email,
            username
        });
        const registeredUser = await User.register(user, password);
        // console.log(registeredUser);
        // res.send(registeredUser);
        res.redirect('/users/login')
        } catch(e) {
            // if something wrong redirect the user
            // normally we would use flash
            res.redirect('/users')
        }
}

exports.loginForm = async(req, res)=>{
    res.render('users/login', {fontAwesomeSrc});
}

exports.login = async(req, res)=>{
    req.flash('success', 'You are now logged in!')
    res.redirect('/arts');
}

exports.logOut = async(req, res)=>{
    req.logout();
    // req.flash('success', 'Goodbye!');
    res.redirect('/arts');
}