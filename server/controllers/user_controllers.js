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
        const {email, username, DOB, password} = req.body;
        const user = new User({
            email,
            username,
            DOB,
        });
        console.log(DOB);
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        // res.send(registeredUser);
        await registeredUser.save();
        // console.log(user);
        res.redirect('/users/login')
        // res.send(req.body);
        } catch(e) {
            // if something wrong redirect the user
            // normally we would use flash
            console.log('an error occured')
            console.log(e);
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