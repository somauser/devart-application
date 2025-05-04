require('dotenv').config();
const User = require('../models/User')

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]
const fontAwesomeSrc = process.env.fontAwesomeAPI;

exports.getHome = async (req, res)=>{
    const {user} = req.params;
    res.redirect('/arts');
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
        // flash
        user.Bio.profileImage.url = 'https://dev-app-clone-994214.s3.amazonaws.com/1646642994810__cat.jpg'
        // console.log(DOB);
        const registeredUser = await User.register(user, password);
        // console.log(registeredUser);
        // res.send(registeredUser);c
        await registeredUser.save();
        // console.log(user);
        req.flash('success', 'User is created successfully!');
        res.redirect('/users/login');
        // res.send(req.body);
        } catch(e) {
            // if something wrong redirect the user
            // normally we would use flash
            // console.log('an error occured')
            // console.log(e);
            req.flash('error', e.message);
            res.redirect('/users/new');
        }
}

exports.getLogin = async(req, res)=>{
    res.render('users/login');
}

exports.login = async(req, res)=>{
    req.flash('success', `Welcome ${req.user.username}!`)
    res.redirect('/arts');
}

exports.logOut = async(req, res)=>{
    req.logout();
    // req.flash('success', 'Goodbye!');
    res.redirect('/arts');
};

exports.showUser = async(req, res)=>{
    const {id} = req.params;

    const user = await User.findById(id).populate('arts');
    console.log(user.arts);
    res.render('users/show', {user, arts: user.arts});
};

exports.updateUser = async(req, res)=>{
    try{
        const {id} = req.params
        const {profileImage, bio} = req.body
        const user = await User.findById(id);
      if(req.file){
        user.Bio.profileImage.url = req.file.location,
        user.Bio.profileImage.filename = req.file.key
      }
      console.log(req.file)
      console.log(req.body)
      user.Bio.text = bio;
      await user.save();
      res.redirect(`/users/${id}`);
    } catch(err) {
        console.log(err);
        res.render('500');
    }
};