const express = require('express');
const route = express.Router();
const auth = require('../middlewares/auth');

route.get('/', auth.isLoggedin, (req, res)=>{
    res.send('Home');
})


module.exports = route;