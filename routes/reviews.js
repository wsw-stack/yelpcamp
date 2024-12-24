const express = require('express')
const router = express.Router({mergeParams: true}) // merge the campground id param from outside
const Joi = require('joi')

const catchAsync = require('../utils/catchAsync')
const Review = require('../models/review')
const Campground = require('../models/campground')
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware')
const { createReview, deleteReview } = require('../controllers/reviewController')

router.post('/', isLoggedIn, validateReview, catchAsync(createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(deleteReview))

module.exports = router