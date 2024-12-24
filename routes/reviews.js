const express = require('express')
const router = express.Router({mergeParams: true}) // merge the campground id param from outside
const Joi = require('joi')

const catchAsync = require('../utils/catchAsync')
const Review = require('../models/review')
const Campground = require('../models/campground')
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware')



router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Successfully made a review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted a review!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router