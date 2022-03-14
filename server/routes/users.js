const express = require('express');
const passport = require('passport');
const route = express.Router();
const auth = require('../middlewares/auth');
const userControllers = require('../controllers/user_controllers');
const { find, findById } = require('../models/User');
const User = require('../models/User');
const s3AccessKey = process.env.S3_ACCESS_KEY
const s3SecretKey = process.env.S3_SECRET_ACCESS_KEY
const s3Buceket = process.env.S3_BUCKET_REGION
const multer = require('multer')
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const s3 = new aws.S3({
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretKey,
    region: s3Buceket
})

const upload = multer({
    storage: multerS3({
        // s3 
        s3: s3,
        bucket: "dev-app-clone-994214",
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
          },
          key: function (req, file, cb) {
            cb(null, Date.now()+ "__" + file.originalname);
          }
    })
});

route.get('/', userControllers.getHome);

route.get('/new', userControllers.getNew);

route.post('/', userControllers.createUser);


route.get('/login', userControllers.getLogin);

route.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect:'/users/login'}), userControllers.login);

route.get('/logout', (userControllers.logOut));

// users/:id
route.get('/:id', userControllers.showUser);

// GET user/:id/account
route.get('/:id/account', async(req, res)=>{
    // const id = req.user._id;
    res.render('users/account');   
})

// PUT users/:id update user
route.put('/:id', auth.isLoggedin, upload.single('profileImage'), auth.isAuthortized, userControllers.updateUser)


module.exports = route;