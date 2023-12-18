const axios = require('axios');
const College = require('../models/college');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { string } = require('joi');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
module.exports.index = async (req, res) => { 
  const colleges = await College.find({});
  res.render('colleges/index', { colleges })
}
module.exports.renderNewForm = (req, res) => {
  res.render('colleges/new');
}

module.exports.searchColleges = async (req, res) => {
  const searchQuery = req.query.collegeName;
  console.log(searchQuery);
  const regex = new RegExp(searchQuery, 'i');
  const colleges = await College.find({ $or: [
    { title: { $regex: regex } },
    { description: { $regex: regex } },
  ]});

  res.render("colleges/search", {colleges}); 
}

module.exports.createNewcollege = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.college.location,
    limit: 1
  }).send();
  const college = new College(req.body.college);
  college.images = req.files.map(f => ({url: f.path, filename: f.filename}));
  college.author = req.user._id;
  college.geometry = geoData.body.features[0].geometry;
  console.log(college);
  await college.save();
  req.flash('success', 'Successfully created a new college !'); 
  res.redirect(`/colleges/${college._id}`)
}
module.exports.showcollege = async (req, res,) => {
  const college = await College.findById(req.params.id).populate({
    path: 'reviews',
    populate:{
      path: 'author'
    }
  }).populate('author');
  if(!college){
    req.flash('error', 'Cannot find any college !');
    return res.redirect('/colleges');
  }

  // calculate individual sentiments-----------------------------------
  let sentimentArray=[];
  let totSentiments = 0;

  async function fetchSentiment(i){
    try{
      response = await axios.get("http://127.0.0.1:9000/sentiment/", { 
        params :{sentence: college.reviews[i].body} 
      });
      // console.log(parseFloat(response.data.compound))
      let calcScore = (parseFloat(response.data.compound) + 1) * 50;
      totSentiments = totSentiments + calcScore;
      sentimentArray.push((calcScore).toFixed(2));
    }
    catch(error){
      console.error('Error:', error.message);
    }
  };
  for(let i = 0; i < college.reviews.length; i++){
    await fetchSentiment(i);
  } 
  // console.log(sentimentArray)
  // calculate average sentiments --------------------------------------
  let avgSentiment = totSentiments / college.reviews.length ;
  avgSentiment = avgSentiment.toFixed(2);
  // console.log(avgSentiment);
  // calculate average review rating-----------------------------------
  let avgRating = 0;
  if(college.reviews.length){
    const ratings = college.reviews.map(review => review.rating);
    avgRating = ratings.reduce((acc, cur) => acc + cur) / ratings.length;
  }
  avgRating = avgRating.toFixed(1);
  const starArray = [];
  for(let i = 1; i <= 5; i++){
    if(i <= avgRating){
        starArray.push("width: 100%");
    }
    else{
      if(i - avgRating <= 1){
        const rem = (100 - (i - avgRating) * 100);
        starArray.push("width: " + rem + "%");
      }
      starArray.push("width: 0%");
    }
  }
  res.render('colleges/show', { college, msg: req.flash("success"), avgRating, starArray, sentimentArray, avgSentiment});
}

module.exports.renderEditForm = async (req, res) => {
  const college = await College.findById(req.params.id).populate('author');
  if(!college){
    req.flash('error', 'Cannot find any college !');
    return res.redirect('/colleges');
  }

  res.render('colleges/edit', { college });
}

module.exports.updatecollege = async (req, res) => {
  const { id } = req.params; 
  const college = await College.findByIdAndUpdate(id, { ...req.body.college });
  const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
  college.images.push(...imgs);
  await college.save();
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
    await college.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
  }
  req.flash('success', 'Successfully updated college !');
  res.redirect(`/colleges/${college._id}`)
}

module.exports.deletecollege = async (req, res) => {
  const { id } = req.params;
  const college = await College.findById(id);
  if(!college.author.equals(req.user._id) ){
    req.flash('error', "You do not have permission to perform this operation");
    return res.redirect(`/colleges/${id}`);
  }
  await College.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted college !');
  res.redirect('/colleges');
}