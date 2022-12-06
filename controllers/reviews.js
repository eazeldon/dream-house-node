const House = require('../models/house');
const Review = require('../models/review');

module.exports.createReviews = async (req, res) => {
    ///TES-res.send('YOU MADE IT!!!')
    const house = await House.findById(req.params.id);
    const review = new Review(req.body.review);
    //--ADD Author
    review.author = req.user._id;

    house.reviews.push(review);
    await review.save();
    await house.save();
    req.flash('success', 'Added a new review!');
    res.redirect(`/houses/${house._id}`);
}

module.exports.deleteReviews = async (req, res) => {
    const { id, reviewId } = req.params;
    await House.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/houses/${id}`);
    //res.send("DELETE ME")*/
}