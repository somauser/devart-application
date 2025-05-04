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
const Comment = require('../models/Comment');
const User = require('../models/User');
const { findByIdAndUpdate, findById } = require('../models/User');
// https://www.youtube.com/watch?v=s1Tu0yKmDKU add public policy
const s3AccessKey = process.env.S3_ACCESS_KEY
const s3SecretKey = process.env.S3_SECRET_ACCESS_KEY
const region = process.env.S3_BUCKET_REGION
const s3Bucket = process.env.S3_BUCKET

const s3 = new aws.S3({
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretKey,
    region: region
})

const upload = multer({
    storage: multerS3({
        // s3 
        s3: s3,
        bucket: s3Bucket,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
          },
          key: function (req, file, cb) {
            cb(null, Date.now()+ "__" + file.originalname);
          }
    })
});

// GET /arts
route.get('/', artControllers.getIndex)


// GET /arts/new
route.get('/new', auth.isLoggedin, artControllers.getNew);


// test deleteing 
// route.get('/test', async(req, res)=>{
  
//   const user = await User.findById('6212ee4433f6875e8f4450d2')
//   user.arts.pull('6225ac69958158f26d8f69ca');
//   await user.save();
//   // User.findByIdAndUpdate('6212ee4433f6875e8f4450d2', { 
//   //   $pull:{arts: {_id: '6225ac69958158f26d8f69ca'}}
//   // }, {new: true});
//   res.send(user);
// })

// GET /arts/:id
route.get('/:id', artControllers.showArts);

// GET /arts/:id/edit
route.get('/:id/edit', auth.isAuthor, artControllers.getEditArtsPage);

// POST /arts/:id
// route.post('/:id', auth.isLoggedin, upload.single('art'), async(req, res)=>{
//     // res.send('it worked')
//     try{
//       console.log(req.body);
//       const {id} = req.params;
//       const {title, description} = req.body;
//       const art = await Arts.findByIdAndUpdate(id, {
//           title,
//           description
//       });
//       const savedArt = await art.save();
//       res.redirect(`/arts/${id}`)
//     } catch(err) {
//       console.log('err' + err);
//       res.status(500).send(err);
//     }
// })

// check if the signedUser is the owner of the painting
// if yes updated
// if not res.send(401) status
route.put('/:id', auth.isLoggedin, upload.single('art'), auth.isAuthor, artControllers.putArts);

// DELETE 
route.delete('/:id', auth.isLoggedin, artControllers.deleteArts);



// POST /arts
// art is the name for the field
route.post('/', auth.isLoggedin, upload.single('art'), artControllers.postArt);


// 
// create a comment 
// arts/:id/comments POST
route.post('/:id/comments', artControllers.createComment);

module.exports = route;