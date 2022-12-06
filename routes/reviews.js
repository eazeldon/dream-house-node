
//Routes 
const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const House = require('../models/house');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

//const { reviewSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


/*
//cmd d
///middleware from router
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}*/

////Review
///Add isLoggedIn
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReviews))

//// --move to controllers reviews js ----
/*router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
///TES-res.send('YOU MADE IT!!!')
const campground = await Campground.findById(req.params.id);
const review = new Review(req.body.review);
//--ADD Author
review.author = req.user._id;

campground.reviews.push(review);
await review.save();
await campground.save();
req.flash('success', 'Added a new review!');
res.redirect(`/campgrounds/${campground._id}`);
}))*/
////Delete Review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReviews))
///move to controllers
/*router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
    //res.send("DELETE ME")*/
/*}))*/

module.exports = router;