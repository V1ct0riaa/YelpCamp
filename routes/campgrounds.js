const express = require('express');
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground');
const {campgroundSchema } = require('../schemas')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

const campgrounds = require('../controllers/campgrounds')


router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
}) 

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {    
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id
    await campground.save();
    // flash is usually used with redirect
    req.flash('success', 'Successfully made a new Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id',  catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    .populate({
        path: 'reviews', //ambil reviews dari campground
        populate: {
            path: 'author' //ambil author dari reviews
        }
    })
    .populate('author') // ambil author dari campground
    console.log(campground)
    if(!campground){
        req.flash('error', 'Cannot find that particular campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'Cannot find that particular campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthor , validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully Deleted a Campground')
    res.redirect('/campgrounds');
}));

module.exports = router