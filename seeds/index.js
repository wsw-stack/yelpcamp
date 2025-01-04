const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require("./seedsHelper")
const Campground = require('../models/campground')
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log('Connected!'))
    .catch(err => console.log('Connection failed ' + err))

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000)
        const campground = new Campground({
            author: '676839fd83e6fbf19fd0bf93',
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: { type: 'Point', coordinates: [-112.98344, 37.20612] },
            images: [
                {
                    url: 'https://res.cloudinary.com/dcyu2b3kl/image/upload/v1735191430/YelpCamp/g7vj6ymf2fvekzbgn9hh.webp',
                    filename: 'YelpCamp/g7vj6ymf2fvekzbgn9hh',
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro earum aspernatur cupiditate animi nisi hic, qui voluptate, excepturi consequuntur praesentium quam nesciunt totam corrupti a quasi incidunt! Odio, sequi quasi.',
            price: Math.floor(Math.random() * 20) + 10
        })
        await campground.save()
    }
}
seedDB()