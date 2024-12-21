const express = require('express')
const app = express()
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const ExpressError = require('./utils/ExpressError')
const ejsMate = require('ejs-mate')

const campgroundRoutes= require('./routes/campgrounds')
const reviewRoutes= require('./routes/reviews.js')

mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(() => console.log('Connected!'))
.catch(err => console.log('Connection failed ' + err))

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use('/public', express.static(__dirname + '/public'))

const sessionConfig = {
    secret: 'this should be a better secret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 7 * 24 * 3600 * 1000,
        maxAge: 7 * 24 * 3600 * 1000
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

// for every requst not defined above, we consider this a 404 error
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err
    if(!err.message) err.message = 'Something went wrong!'
    res.status(statusCode, 500).render('error', {err})
})

app.listen(3000, ()=> {
    console.log('Serving on port 3000')
})