const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))) // to serve public static files

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }

}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize()) // turns on passport for every incoming request
app.use(passport.session()) // session based login state and restores it to req.user
passport.use(new LocalStrategy(User.authenticate())) // local means username/password
// User.authenticate() comes from passport-local-mongoose
// it handles checking the username/password against the db user

// how do we store user into the session
passport.serializeUser(User.serializeUser()) // after login, saves user identity to session
// what user info gets stored in the session cookie store (user_id)

// how do we get user out of the session
passport.deserializeUser(User.deserializeUser()) // logout, restores user identity from session

app.use((req,res,next) =>{
    // take current user
    res.locals.currentUser = req.user
    // take whatever in the flash under success
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next() // remember middleware always use next
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next) =>{
    const {statusCode = 500} = err
    if(!err.message) err.message = 'Oh no something went wrong'
    res.status(statusCode).render('error', {err})
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
})