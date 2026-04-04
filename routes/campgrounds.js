const express = require('express');
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, isAuthor, validateCampground, validateCampgroundImages } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')

const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, validateCampgroundImages,
        catchAsync(campgrounds.createCampground))
    

router.get('/new', isLoggedIn,
    campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, 
        upload.array('image'),validateCampground,
        catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor,
        catchAsync(campgrounds.deleteCampground))

router.route('/:id/edit')
    .get(isLoggedIn,
        isAuthor, catchAsync(campgrounds.renderEditform))
    .get(isLoggedIn,
        isAuthor, catchAsync(campgrounds.renderEditform))


module.exports = router