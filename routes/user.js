const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');

router.route('/register')
  .get(users.rederRegister)
  .post(catchAsync(users.register));
  
router.route('/login')
  .get(users.renderLogin)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.login)

// ---------------logout route ----------------
router.get("/logout", function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'Good Bye!');
    res.redirect("/colleges");
  });
});
module.exports = router;