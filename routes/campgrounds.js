const express = require('express')
const router = express.Router()
const Joi = require('joi')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const { index, renderNewForm, createCampground, showCampground, renderEditForm, updateCampground, deleteCampground } = require('../controllers/campgroundControllers')

router.route('/')
    .get(catchAsync(index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(createCampground))

router.get('/new', isLoggedIn, catchAsync(renderNewForm))

router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(renderEditForm))

module.exports = router