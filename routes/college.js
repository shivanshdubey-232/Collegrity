const express = require('express');
const router = express.Router();
const colleges = require('../controllers/colleges');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validatecollege, isAuthor} = require('../middleware.js');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});


router.route('/')
  .get(catchAsync(colleges.index))
  .post(isLoggedIn, upload.array('image'), validatecollege,catchAsync(colleges.createNewcollege));
  
router.get('/new', isLoggedIn, colleges.renderNewForm);

router.route('/:id')
  .get(catchAsync(colleges.showcollege))
  .put(isLoggedIn, isAuthor, upload.array('image'),validatecollege, catchAsync(colleges.updatecollege))
  .delete( isLoggedIn, isAuthor, catchAsync(colleges.deletecollege));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(colleges.renderEditForm));

module.exports = router;