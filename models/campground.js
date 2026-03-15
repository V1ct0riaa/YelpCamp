// Load the Mongoose Library
const mongoose = require('mongoose')

// Takes the Schema constructor
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
})

module.exports = mongoose.model('Campground', CampgroundSchema)