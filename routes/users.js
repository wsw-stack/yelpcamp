const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const {storeReturnTo} = require('../middleware')
const { renderRegister, register, renderLogin, login, logout } = require('../controllers/userController')

router.route('/register')
    .get(renderRegister)
    .post(catchAsync(register))


router.route('/login')
    .get(renderLogin)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(login))

router.get('/logout', logout)

module.exports = router