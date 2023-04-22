const{collegeSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const College = require('./models/college.js');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()){
    console.log(req.originalUrl);
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in first !');
    return res.redirect('/login');
  }
  next();
}

module.exports.validatecollege = (req, res, next) => {
  const {error} = collegeSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message);
    throw new ExpressError(msg, 400);
  } else{
    next();
  }
} 

module.exports.isAuthor = async(req, res, next) => {
  const {id} = req.params;
  const college = await College.findById(id).populate('author');
  if(!college.author.equals(req.user._id) ){
    req.flash('error', "You do not have permission to perform this operation");
    return res.redirect(`/colleges/${id}`);
  }
  next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
  const {id, reviewId} = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id) ){
    req.flash('error', "You do not have permission to perform this operation");
    return res.redirect(`/colleges/${id}`);
  }
  next();
}

module.exports.validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message);
    throw new ExpressError(msg, 400);
  }else{
    next();
  }
}
