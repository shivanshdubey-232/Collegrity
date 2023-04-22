const College = require('../models/college');
const Review = require('../models/review');

module.exports.createReview = async(req, res) => {
  const college = await College.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  college.reviews.push(review);
  await review.save();
  await college.save();
  req.flash('success', 'Successfully created a new review !');
  res.redirect(`/colleges/${college._id}`);
}
module.exports.deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.reviewId);
  await College.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId}});
  req.flash('success', 'Successfully deleted a review !');
  res.redirect(`/colleges/${req.params.id}`);
}