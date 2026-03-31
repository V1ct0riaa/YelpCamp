const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// https://res.cloudinary.com/dqaesraex/image/upload/w_400/v1774945080/YelpCamp/frxm9tvyeofwuga8op5e.jpg

const ImageSchema = new Schema({   
    url: String,
    filename: String
})

// dont need to store on model, but derived from already stored data
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
})

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review' // from the Review Model
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);