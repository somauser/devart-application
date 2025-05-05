require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { getHome } = require('./controllers/user_controllers');
const app = express();
const port = process.env.PORT | 7098;
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
var favicon = require('serve-favicon');
const basePath = process.env.BASE_PATH || '/';

// routers
const userRoutes = require('./routes/users')
const artRoutes = require('./routes/arts')
// const apisArtRoutes = require('./routes/apis_arts');
// session 
sessionOptions = {
    resave: false,
    saveUninitialized: false,
    secret:process.env.s_secret,
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

app.use(basePath, express.static(path.resolve(__dirname,'public')));
// app.use(express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));
app.engine('ejs', ejsMate);

// database connection
async function connect(){
    mongoose.connect(process.env.mongo_DB);
   
}
const db = mongoose.connection;

db.on('open', async () => {
    Art.find({}, function(err, items) {
        if(err) {
            console.log(err);
        } else {
            console.log(items)
        }
    })
});


connect().then(res=>console.log('DB connected'))
    .catch(err=>console.log(err));

// pass required stuff
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// set local var for res

// store the signedUser 
app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.signedUser = req.user;
    next();
})

app.use(basePath +'/arts', artRoutes);
app.use(basePath + '/users', userRoutes);
// app.use('/apis/arts', apisArtRoutes);

app.get(basePath + '/test', (req, res)=>{
  res.render('test')  
})

// Handling non matching request
app.use((req, res, next) => {
    res.status(404).render('404')
  })


app.listen(port, ()=>{
    console.log(`app is running on port: ${port}`);
    console.log(process.env.S3_ACCESS_KEY);
})
