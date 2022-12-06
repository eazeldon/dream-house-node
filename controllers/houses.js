
const House = require('../models/house');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


/////---from Rounter
module.exports.index = async (req, res) => {
    const houses = await House.find({});
    res.render('houses/index', { houses })
}

module.exports.renderNewForm = (req, res) => {
    res.render('houses/new');
}
////--Create or update
module.exports.createHouse = async (req, res, next) => {
    //---Map
    const geoData = await geocoder.forwardGeocode({
        query: req.body.house.location,
        limit: 1

    }).send()
    const house = new House(req.body.house);
    house.geometry = geoData.body.features[0].geometry;
    //res.send("OK!!")
    //---end--Map
    //const campground = new Campground(req.body.campground);--move
    ////**Cloudinary file*/
    house.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    ////--Author with id
    house.author = req.user._id;

    await house.save();
    console.log(house);
    req.flash('success', 'Successfully Add A New dream-house');
    res.redirect(`/houses/${house._id}`)
}

module.exports.showHouse = async (req, res) => {
    //--const house = await House.findById(req.params.id).populate('reviews').populate('author');
    const house = await House.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    //--console.log(campground);
    ///error
    if (!house) {
        req.flash('error', 'Cannot find that dream-house!');
        return res.redirect('/houses');
    }

    res.render('houses/show', { house });
}

module.exports.renderEditForm = async (req, res) => {

    const { id } = req.params;
    const house = await House.findById(id)
    if (!house) {
        req.flash('error', 'Cannot find that dream-house!');
        return res.redirect('/houses');
    }

    res.render('houses/edit', { house });

}
////Edit or Update
module.exports.updateHouse = async (req, res) => {


    const { id } = req.params;
    //-----delete checkbox
    console.log(req.body);
    const house = await House.findByIdAndUpdate(id, { ...req.body.house });
    ////**Cloudinary file*/
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    house.images.push(...imgs);
    await house.save();
    ///---Delete-images-checkbox-edit
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await house.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        //console.log(house)
    }
    ///---Delete-images-checkbox-edit

    req.flash('success', 'Successfully updated dream-house!');
    res.redirect(`/houses/${house._id}`)
}

module.exports.deleteHouse = async (req, res) => {
    const { id } = req.params;
    await House.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted dream-house')
    res.redirect('/houses');
}