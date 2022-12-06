//Routes 
const express = require('express');
const router = express.Router();
const houses = require('../controllers/houses');
const catchAsync = require('../utils/catchAsync');
//const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateHouse } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
//const upload = multer({ dest: 'uploads/' });

//const ExpressError = require('../utils/ExpressError');
const House = require('../models/house');

//NEW ROUTER GROUPING

router.route('/')
    .get(catchAsync(houses.index))
    .post(isLoggedIn, upload.array('image'), validateHouse, catchAsync(houses.createHouse))


router.get('/new', isLoggedIn, houses.renderNewForm)

router.route('/:id')
    .get(catchAsync(houses.showHouse))
    ////----folder uploads
    .put(isLoggedIn, isAuthor, upload.array("image"), validateHouse, catchAsync(houses.updateHouse))
    //.put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(houses.deleteHouse))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(houses.renderEditForm))

module.exports = router;
