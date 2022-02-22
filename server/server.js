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
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
const multer = require('multer')
// https://www.mongodb.com/languages/mern-stack-tutorial

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


// parse file from the form
// multer({dest: ''});
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname,'public')));
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

app.use('/arts', artRoutes)
app.use('/users', userRoutes)

app.listen(port, ()=>{
    console.log(`app is running on port: ${port}`);
})
