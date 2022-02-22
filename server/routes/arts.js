const express = require('express');
const route = express.Router();
const auth = require('../middlewares/auth');
const artControllers = require('../controllers/art_controllers');
const Arts = require('../models/Art');

route.get('/', auth.isLoggedin, (req, res)=>{
    res.send('Home');
})

route.get('/new', auth.isLoggedin, artControllers.getNew);

route.get('/:id', artControllers.showArts);

route.post('/', auth.isLoggedin, artControllers.postArt);


module.exports = route;