const { houseSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const House = require('./models/house');
const Review = require('./models/review');
module.exports.isLoggedIn = (req, res, next) => {
    ///--you have to register or login-- console.log("REQ.USER...", req.user);
    //console.log("REQ.USER...", req.user);
    ///---register no need to login -- req.session.returnTo = req.originalUrl
    if (!req.isAuthenticated()) {
        //--Move to app js -- req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

///middleware form router campgrounds js const--change to module.exports.
module.exports.validateHouse = (req, res, next) => {
    const { error } = houseSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

///middleware isAuthor from router campgrounds js const change to module.exports.
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const house = await House.findById(id);
    if (!house.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/houses/${id}`);
    }
    next();
}

///middleware isReviewAuthor from router campgrounds js const change to module.exports.
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/houses/${id}`);
    }
    next();
}
///from router reviews js
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
