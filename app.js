if(process.env.NODE_ENV !== "production"){  
  require('dotenv').config();
}

const express = require("express");
const path = require("path");
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy= require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
 
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://shivanshdubey232:q2Y3llPNpATBWgIa@cluster0.vrbl8cy.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true})
.then(() =>{
    console.log("Connection open !");
})
.catch((err) => {
    console.log("Oh No! Error :(");
    console.log(err); 
} )
  
const app = express();

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const collegeRoutes = require('./routes/college');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');

const user = require("./models/user");

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
//inorder to remve the $ sign from the querystring
app.use(mongoSanitize());
const sessionConfig = {
  secret : 'thisisasecret',
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly:true,
    expires: Date.now() + 1000*60*60*24*7,
    maxAge: 1000*60*60*24*7
  }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) =>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) =>{
  res.render("home");
});

//----------------importing routes------------------ 
app.use('/', userRoutes);
app.use('/colleges', collegeRoutes);
app.use('/colleges/:id/reviews', reviewRoutes);

//------------------error handling------------------
app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found !', 404));
});
app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if(!err.message) { err.message = "Oh No, Something went wrong !!!"};
  res.status(statusCode).render('error', {err});
});

// -------------listening--------------------------
app.listen("8080", (req, res) =>{
    console.log("Listening in port 8080...");
});