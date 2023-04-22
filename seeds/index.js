const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Spot = require('../models/spot');

const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/Roveo', {
    useNewUrlParser: true,
    useUnifiedTopology: true})
    .then(() =>{
        console.log("Connection open !");
     })
    .catch((err) => {
        console.log("Oh No! Error :(");
        console.log(err); 
    } )
    

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Spot.deleteMany({});
    // for (let i = 0; i < 50; i++) {
    //     const random1000 = Math.floor(Math.random() * 1000);
    //     const price = Math.floor(Math.random() * 20) + 10; 
    //     const camp = new Spot({
    //         author: '643d27aa15c3ff993ce5a84a',
    //         location: `${cities[random1000].city}, ${cities[random1000].state}`,
    //         title: `${sample(descriptors)} ${sample(places)}`,
    //         description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Totam, similique doloribus, laborum quaerat culpa excepturi libero molestiae dolore nisi commodi rem, deleniti provident quod nemo exercitationem explicabo eum voluptas perferendis.',
    //         price: price,
    //         geometry: {
    //             type: "Point",
    //             coordinates: [
    //                 cities[random1000].longitude,
    //                 cities[random1000].latitude,
    //             ]
    //         },
    //         images: [
    //             {
    //               url: 'https://res.cloudinary.com/dp22k1vwj/image/upload/v1681797399/Roveo/urmmc0vvuxwxh2heahqu.jpg',
    //               filename: 'Roveo/urmmc0vvuxwxh2heahqu'
    //             },
    //             {
    //               url: 'https://res.cloudinary.com/dp22k1vwj/image/upload/v1681797405/Roveo/a22y5lck7kpadeujcpyj.jpg',
    //               filename: 'Roveo/a22y5lck7kpadeujcpyj'
    //             },
    //             {
    //               url: 'https://res.cloudinary.com/dp22k1vwj/image/upload/v1681797412/Roveo/iy5rdzscbyvzgfaakqzr.jpg',
    //               filename: 'Roveo/iy5rdzscbyvzgfaakqzr'
    //             }
    //         ]
    //     })
    //     await camp.save();
    // }
}

seedDB().then(() => {
    mongoose.connection.close();
})