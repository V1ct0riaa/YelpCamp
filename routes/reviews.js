const express = require('express');
const router = express.Router({mergeParams: true})

const Campground = require('../models/campground');
const Review = require('../models/review');

const campground = require('../models/campground');


const ExpressError = require('../utils/ExpressError')
const catchAsync = require('../utils/catchAsync')

const { reviewSchema, campgroundSchema } = require('../schemas')


const validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
        next()
    }
}

router.post('/', validateReview,  catchAsync(async(req,res) =>{
    console.log(req.params)
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)// from review[body] in html
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created a New Review!')
    res.redirect(`/campgrounds/${campground._id}`) 
}))

router.delete('/:reviewId', catchAsync(async(req, res)=>{
    const {id, reviewId} = req.params
    // $pull will pull a value from array
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully Deleted a Review')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router