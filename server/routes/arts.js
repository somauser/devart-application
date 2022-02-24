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
const { findByIdAndUpdate } = require('../models/User');
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

// GET /arts
route.get('/', artControllers.getIndex)


// GET /arts/new
route.get('/new', auth.isLoggedin, artControllers.getNew);

// GET /arts/:id
route.get('/:id', artControllers.showArts);

// GET /arts/:id/edit
route.get('/:id/edit', async(req, res)=>{
  const {id} = req.params;
  const art = await Arts.findById(id);
  // res.send(art);
  console.log(art);
  res.render('arts/edit', {art})
});

// POST /arts/:id
route.post('/:id', auth.isLoggedin, upload.single('art'), async(req, res)=>{
    // res.send('it worked')
    try{
      console.log(req.body);
      const {id} = req.params;
      const {title, description} = req.body;
      const art = await Arts.findByIdAndUpdate(id, {
          title,
          description
      });
      const savedArt = await art.save();
      res.redirect(`/arts/${id}`)
    } catch(err) {
      console.log('err' + err);
      res.status(500).send(err);
    }

})


// POST /arts
// art is the name for the field
route.post('/', auth.isLoggedin, upload.single('art'), artControllers.postArt);


// 
// create a comment 
// arts/:id/comments POST
route.post('/:id/comments', async (req, res)=>{
  const {id} = req.params;
  // const user_id = req.user._id;
  const user = await User.findById(req.user._id);
  const art = await Arts.findById(id);
  const comment = new Comment({
    text: req.body.comment
  });
  comment.art = art; 
  comment.user = req.user;
  user.comments.push(comment);
  art.comments.push(comment);
  await art.save(); 
  await comment.save();
  await user.save();
  // console.log(user);
  // res.send(user);
  // Create a comment
  // res.send(req.user);
  res.redirect(`/arts/${id}`);
})

module.exports = route;