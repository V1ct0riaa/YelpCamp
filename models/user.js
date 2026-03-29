const mongoose = require('mongoose')
const Schema = mongoose.Schema

const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// this will add on our schema a username, password
UserSchema.plugin(passportLocalMongoose.default);

module.exports = mongoose.model('User', UserSchema)