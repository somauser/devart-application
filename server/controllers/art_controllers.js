const User = require('../models/User');
const Art = require('../models/Art');
const Comment = require('../models/Comment');

require('dotenv').config();
const fontAwesomeSrc = process.env.fontAwesomeAPI;

exports.getNew = async (req, res)=>{
    // console.log(user);
    res.render('arts/new', {fontAwesomeSrc})
}

exports.postArt = async (req, res, next)=>{
    try {

    // access user info from session
    const {title, description, tags} = req.body;
    // const {name, price} = req.body;
    const user = await User.findById(req.user._id);
    const art = new Art({
        title,
        description,
    });
    // tags is an array with object containing value key
    // console.log(req.body);
    art.imageURL.url = req.file.location,
    art.imageURL.filename = req.file.key
    // add it to the user 
    user.arts.push(art);
    art.user = user;
    // adding tags to tags
    tags_list = JSON.parse(tags);
    console.log(tags_list);
    if(tags_list){
        tags_list.forEach((tag)=>{
            art.meta.tags.push(tag.value)
            console.log(tag.value);
        })
    }
    await user.save();
    await art.save();
    // console.log(req.body, req.file);
    // console.log(art);
    req.flash('success', 'Successfully posted art')
    res.redirect(`/arts/${art._id}`);
    // res.send(req.body);
  } catch(err){
    console.log(err);
    res.render('500');
  }
}

exports.showArts = async (req, res)=>{
    try {
        const {id} = req.params 
        const art = await Art.findById(id).populate('user').populate('comments');
        const comments = await Comment.find({art: art}).populate('user');
        // get arts by user 
        // const arts = await Art.find({user: req.user.username});
        const user = await User.findById(art.user._id).populate('arts');
        // console.log(user.arts)
        // console.log(await art.comments[0].populate('user'))
        console.log(comments);
        res.render('arts/show', {art, arts: user.arts, comments});
    } catch(err){
        res.render('500').status(500);
    }

    // res.send(art)
}

// 'GET /arts'
exports.getIndex = async(req, res)=>{
    if(req.query.q){
      const {q} = req.query;
      // console.log(q)
      const arts = await Art.find({"meta.tags": q}).populate('user').sort({_id:-1}).limit(12);
      res.render('arts/index', {arts, q: req.query.q});
      console.log(arts);
    }
    const arts = await Art.find({}).populate('user').sort({_id:-1}).limit(12);
    res.render('arts/index', {arts, q: req.query.q});
    // res.send(arts[1].user.username)
}


exports.createComment = async (req, res)=>{
    const {id} = req.params;
    // const user_id = req.user._id;
    const user = await User.findById(req.user._id);
    const art = await Art.findById(id);
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
  
    res.redirect(`/arts/${id}`);
  }

// 6212ee4433f6875e8f4450d2

exports.deleteArts =  async(req, res)=>{
    try{
      const {id} = req.params;
      // if the signedIn user is the owner. delete it
      // delete art
        const deletedArt = await Art.findOneAndDelete({_id:id});
        // delete art from user.arts
        const user = await User.findById(deletedArt.user._id);
        user.arts.pull(deletedArt._id);
        await user.save();
        res.redirect('/arts')
    } catch(err){
      console.log(err)
      res.render('500')
    }
  }

  exports.putArts = async(req, res)=>{
    try {
      const {id} = req.params;
      // console.log(req.body);
      const {title, description, tags} = req.body;
      const updatedArt = await Art.findByIdAndUpdate(id, {
        title,
        description
      });
      // if the file input is not empty
      if(req.file){
        updatedArt.imageURL.url = req.file.location,
        updatedArt.imageURL.filename = req.file.key
      }
      // adding tags to tags
      // resetting the tag field
      await Art.findByIdAndUpdate({_id: id}, {$set: {meta: {tags: []}}});
      // adding items to the tag field
      if(tags.length > 0){
        tags_list = JSON.parse(tags);
        console.log(tags_list);
        if(tags_list){
          tags_list.forEach((tag)=>{
            updatedArt.meta.tags.push(tag.value)
              console.log(tag.value);
          })
      }
      }
      await updatedArt.save();
      res.redirect(`/arts/${id}`);
    } catch(err) {
      console.log('err' + err);
      res.render('500');
    }
  }

  exports.getEditArtsPage = async(req, res)=>{
    const {id} = req.params;
    const art = await Art.findById(id);
    // res.send(art);
    console.log(art);
    res.render('arts/edit', {art})
  }