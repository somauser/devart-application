require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { getHome } = require('./controllers/user_controllers');
const app = express();
const port = process.env.PORT | 5050;
const methodOverride = require('method-override');
const User = require('./models/User');
const Art = require('./models/Art')
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const multer = require('multer')
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
var favicon = require('serve-favicon')
// https://www.mongodb.com/languages/mern-stack-tutorial

// const s3 = new aws.S3({
//     accessKeyId: process.env.S3_ACCESS_KEY,
//     secretAccessKey: process.env.S3_SECRET_KEY,
//     region: process.env.S3_BUCKET_REGION
// })

// const upload = multer({
//     storage: multerS3({
//         // s3 
//         s3: s3,
//         bucket: "dev-app-clone-994214",
//         metadata: function (req, file, cb) {
//             cb(null, {fieldName: file.fieldname});
//           },
//         key: function(req,file,cb){
//             cb(null, file)
//         }
//     })
// });

// routers
const userRoutes = require('./routes/users')
const artRoutes = require('./routes/arts')
// session 
sessionOptions = {
    secret:process.env.secret,
    resave: false,
    saveUninitialized: false,
}
app.use(session(sessionOptions))
app.use(flash())

// setting favicom
app.use(favicon(path.join(__dirname, 'public','images','favicon.ico')))
// parse file from the form
// multer({dest: ''});
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname,'public')));
// app.use(express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.engine('ejs', ejsMate);

// database connection
async function connect(){
    mongoose.connect(process.env.mongoURI);
}

connect().then(res=>console.log('DB connected'))
    .catch(err=>console.log(err));

// pass required stuff
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// set local var for res

app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.signedUser = req.user;
    next();
})

app.use('/arts', artRoutes)
app.use('/users', userRoutes)

app.get('/test', (req, res)=>{
  res.render('test')  
})


app.listen(port, ()=>{
    console.log(`app is running on port: ${port}`);
})
