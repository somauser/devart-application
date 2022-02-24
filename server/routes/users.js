const express = require('express');
const passport = require('passport');
const route = express.Router();
const userControllers = require('../controllers/user_controllers');
const User = require('../models/User');

route.get('/', userControllers.getHome);

route.get('/new', userControllers.getNew);

route.post('/', userControllers.createUser);

route.get('/login', userControllers.loginForm);

route.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect:'/users/login'}), userControllers.login);

route.get('/logout', (userControllers.logOut));

// users/:id
route.get('/:id', async(req, res)=>{
    const {id} = req.params;
    const user = await User.findById(id).populate('arts');
    console.log(user.arts);
    res.render('users/show', {user, arts: user.arts});
})

// GET user/:id/account
route.get('/:id/account', async(req, res)=>{
    // const id = req.user._id;
    res.render('users/account');   
})

module.exports = route;