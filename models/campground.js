const mongoose = require('mongoose')
const Review = require('./review')
const { campgroundSchema } = require('../schemas')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200') // make width of 200 (for displaying)
})

const opts = {toJson: {virtuals: true}, toObject: { virtuals: true }}
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            // embed the related reviews
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
}, opts)
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
})

//remove corresponding reviews
CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)