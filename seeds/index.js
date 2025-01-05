require('dotenv').config();
const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require("./seedsHelper")
const Campground = require('../models/campground')
const db_url = process.env.DB_URL

mongoose.connect(db_url)
    .then(() => console.log('Connected!'))
    .catch(err => console.log('Connection failed ' + err))

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 500; i++) {
        const random = Math.floor(Math.random() * 1000)
        const campground = new Campground({
            author: '677ae1e5b1cc4b6357459efc',
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: { type: 'Point', coordinates: [cities[random].longitude, cities[random].latitude] },
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