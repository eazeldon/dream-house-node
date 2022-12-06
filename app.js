
//web- https://fathomless-beyond-96711.herokuapp.com/
//--t1/mongod-t2/node app js
//-> node app js

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.SECRET)
console.log(process.env.API_KEY)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const housesRoutes = require('./routes/houses');
const reviewsRoutes = require('./routes/reviews');

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const { contentSecurityPolicy } = require('helmet');
const MongoDBStore = require("connect-mongo")(session);



//FOR DEPLOYING-const dbUrl = process.env.DB_URL;

//connet to mongoDB altas
//_FOR DEPLOYING--mongoose.connect(dbUrl, {
//---original mongoose.connect('mongodb://localhost:27017/camp-site', {

//connect to mongo
//const dbUrl = 'mongodb://localhost:27017/camp-site';

//heroku
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/dreamhouse';
mongoose.connect(dbUrl, {
    userNewUrParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});



const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.on("open", () => {
    console.log("Database connected");

});

const app = express();



app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))



app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
///app.use(express.static('mixcss'));
app.use(express.static(path.join(__dirname, 'mixcss')))
app.use(mongoSanitize({
    replaceWith: '_'
}))

////Change Key for heroku
const secret = process.env.SECRET || 'This should be a better secret';


/////---mongod connect passing url

const store = new MongoDBStore({
    url: dbUrl,
    //secret: 'This should be a better secret',
    secret,
    //-limit time of saving edit uppdate
    touchAfter: 24 * 60 * 60
});
//--passing error
store.on("error", function (e) {
    console.log("SESSSION STORE ERROR", e)

})
/////--end -mongod connect passing url

//seedDB();

/////test inspec Application/ copkie/Console type Date.now()
const sessionConfig = {
    //security ( name: 'session',) login got to Applications inspect
    store,
    name: 'session',
    //secret: "This should be a better secret",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //Security login
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
///Flash
app.use(flash());

//security trace login alert
//-app.use(helmet({ contentSecurityPolicy: false }));

//security in the right way helmet
app.use(helmet());
//////----
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/project-img/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
//////---------security-end

///Authentication passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Flash meddleware
app.use((req, res, next) => {

    //--session
    ///--mongosanitize
    console.log(req.query);
    //--console.log(req.session)
    //---hide  res.locals.currentUser = req.user;/----navbar ejs
    ///---Login problem
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//-----User fake
/*app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'jes@example.com', username: 'jes' });
    const newUser = await User.register(user, 'juice');
    res.send(newUser);

})*/

//-----------------------

///using  routes
app.use('/', userRoutes);
app.use('/houses', housesRoutes)
app.use('/houses/:id/reviews', reviewsRoutes)


app.get('/', (req, res) => {
    //TEST-res.send('WELCOME FROM CAMPSITE')/
    res.render('home')

});
app.get('/about', (req, res) => {
    //TEST-res.send('WELCOME FROM CAMPSITE')/
    res.render('about')

});




////////-------------------------------------

/////////////--------------------------------

////404
app.all('*', (req, res, next) => {
    //TEST-res.send("404!!!!!")
    next(new ExpressError('PAGE NOT FOUND', 404))
})

///Error handler--catchAsync(asyn //500-Something wnet wrong- deflout
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    ////--passing error message-error ejs
    if (!err.message) err.message = 'On NO, Something Went Wrong'
    res.status(statusCode).render('error', { err })
    //res.send('Something went wrong!')

})


/*-original app.listen(3000, () => {
    console.log('Serving on port 3000')

})*/
//----HEROKU 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)

})

