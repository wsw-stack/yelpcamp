const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')

const mongoose = require('mongoose')
const Campground = require('./models/campground')
const campground = require('./models/campground')
mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(() => console.log('Connected!'))
.catch(err => console.log('Connection failed ' + err))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})

app.get('/campgrounds/new', async (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect('/campgrounds')
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    console.log(campground.location)
    res.render('campgrounds/edit', {campground})
})

app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', {campground})
})

app.put('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds`)
})

app.listen(3000, ()=> {
    console.log('Serving on port 3000')
})