const mongoose = require('mongoose')
const Review = require('./review')
const { campgroundSchema } = require('../schemas')
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            // embed the related reviews
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

//remove corresponding reviews
CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)