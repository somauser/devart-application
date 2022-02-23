const express = require('express');
const passport = require('passport');
const route = express.Router();
const userControllers = require('../controllers/user_controllers');

route.get('/', userControllers.getHome);

route.get('/new', userControllers.getNew);

route.post('/', userControllers.createUser);

route.get('/login', userControllers.loginForm);

route.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect:'/users/login'}), userControllers.login);

route.get('/logout', (userControllers.logOut));

module.exports = route;