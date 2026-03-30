const express = require('express');
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');
const {campgroundSchema } = require('../schemas')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

const campgrounds = require('../controllers/campgrounds')


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, 
    campgrounds.renderNewForm) 

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, 
        catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, 
        catchAsync(campgrounds.deleteCampground))

router.route('/:id/edit')
    .get(isLoggedIn, 
    isAuthor, catchAsync(campgrounds.renderEditform))
    .get(isLoggedIn, 
    isAuthor, catchAsync(campgrounds.renderEditform))
    

module.exports = router