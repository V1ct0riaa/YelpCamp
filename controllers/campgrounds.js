const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id
    await campground.save();
    console.log(campground)
    // flash is usually used with redirect
    req.flash('success', 'Successfully made a new Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    .populate({
        path: 'reviews', //ambil reviews dari campground
        populate: {
            path: 'author' //ambil author dari reviews
        }
    })
    .populate('author') // ambil author dari campground
    if(!campground){
        req.flash('error', 'Cannot find that particular campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditform = async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'Cannot find that particular campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(...imgs) //...take data from array and push
    await campground.save()
    if (req.body.deleteImages){
        // pull from images array where the images in req.body.deleteImages
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
        console.log(campground)
    }
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully Deleted a Campground')
    res.redirect('/campgrounds');
}