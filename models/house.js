const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


///--Images in smaller size in delete/update/cloudinary
const ImageSchema = new Schema({

    url: String,
    filename: String
});
///---Uploads resize to small
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

//---popUp Logic location
const opts = { toJSON: { virtuals: true } };


const HouseSchema = new Schema({
    title: String,
    images: [ImageSchema],
    //geo Json map
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    //cloudinary more images
    /* images: [
         {
             url: String,
             filename: String
         }
     ],*/
    price: Number,
    description: String,
    location: String,
    ///-edit and  delete using Login/Register
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

    //--Pass here
}, opts);
///--Pop text address Cluster Maps

HouseSchema.virtual('properties.popUpMarkup').get(function () {
    //return this.url.replace('/upload', '/upload/w_200');
    //---POPup address
    return `<strong><a href="/houses/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 30)}...</p>`

});

HouseSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }

        })

    }

})


module.exports = mongoose.model('House', HouseSchema);