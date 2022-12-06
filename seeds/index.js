
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const House = require('../models/house');

mongoose.connect('mongodb://localhost:27017/dreamhouse', {
    userNewUrParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.on("open", () => {
    console.log("Database connected");

});

const sample = array => array[Math.floor(Math.random() * array.lenght)];

const seedDB = async () => {
    await House.deleteMany({});
    //const c = new House({ title: 'purple field' });
    //await c.save();

    //---50 change to 200
    for (let i = 0; i < 300; i++) {
        const ramdom1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new House({
            //author: '5f5c330c2cd79d538f2c66d9',
            //author: '5fc2ec23f8f9d119e6374d01',
            ////-Mar
            author: '5fd967bb07c2130e75a2d880',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descreptors)} ${sample(places)}`,
            //image: 'https://source.unsplash.com/collection/483251',
            //image: '/img/tree-beach.jpg',
            description: 'God like oxygen you can t see himm, but you can t live without him',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {

                    url: 'https://res.cloudinary.com/project-img/image/upload/v1612926793/camp-site/tkv0loddptiwlq2joybr.jpg',
                    filename: 'camp-site/tkv0loddptiwlq2joybr'
                },
                {

                    url: 'https://res.cloudinary.com/project-img/image/upload/v1612926794/camp-site/ko5aammbzrxtp4p92kwk.jpg',
                    filename: 'camp-site/ko5aammbzrxtp4p92kwk'
                }
            ]
        })
        await camp.save();
    }
}

//seedDB();
//close
seedDB().then(() => {
    mongoose.connection.close();
})


