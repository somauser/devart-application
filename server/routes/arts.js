const express = require('express');
const route = express.Router();
const auth = require('../middlewares/auth');
const artControllers = require('../controllers/art_controllers');
const Arts = require('../models/Art');
// const multer = require('multer')
// const upload = multer({ dest: 'uploads/'});
const multer = require('multer')
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
// https://www.mongodb.com/languages/mern-stack-tutorial

// https://www.youtube.com/watch?v=s1Tu0yKmDKU add public policy

const s3AccessKey = process.env.S3_ACCESS_KEY
const s3SecretKey = process.env.S3_SECRET_ACCESS_KEY
const s3Buceket = process.env.S3_BUCKET_REGION

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

route.get('/', artControllers.getIndex)

route.get('/new',artControllers.getNew);

route.get('/:id', artControllers.showArts);

// art is the name for the field
route.post('/', /*auth.isLoggedin,*/ upload.single('art'), artControllers.postArt);


module.exports = route;