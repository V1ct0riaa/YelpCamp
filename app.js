const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const path = require('path') // for file dir path
const Campground = require('./models/campground')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database Connected')
})

// create the app instance of Express
const app = express() // this object is where routes and server settings are defined


// In js, .set (key,value)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// Home Route
// Req is the coming request object
// Res is the response object
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res) => {
    // const {id} = req.params
    const campgrounds = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campgrounds })
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campgrounds })
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${id}`)
})

app.delete('/campgrounds/:id', async(req,res) =>{
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

// app.listen starts the server on port 3000
app.listen(3000, () => {
    console.log('Serving on Port 3000 ')
})