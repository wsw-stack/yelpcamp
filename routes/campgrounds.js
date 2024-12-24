const express = require('express')
const router = express.Router()
const Joi = require('joi')

const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})

router.get('/new', isLoggedIn, async (req, res) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must log in to create a new campground!')
        return res.redirect('/login')
    }
    res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id // add author information
    await campground.save()
    req.flash('success', 'Successfully made a campground!')
    res.redirect('/campgrounds')
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author' // populate the author of the reviews
        }
    }).populate('author')
    if(!campground) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    req.flash('success', 'Successfully updated a campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted a campground!')
    res.redirect(`/campgrounds`)
}))

module.exports = router