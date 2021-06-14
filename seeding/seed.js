const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Campifiy', { useNewUrlParser: true, useUnifiedTopology: true });
const Camp = require("../models/campmod.js")
const { descriptors, places } = require("./seed_helper.js")
const cities = require("./cities")

rand = (num) => (Math.floor((Math.random() * num) + 1))
// console.log(places.length) //21
// console.log(descriptors.length) //18
const title = `${descriptors[rand(18)]} ${places[rand(21)]}`
// console.log(title)
// console.log(cities.length) //1000
const location = `${cities[rand(1000)].city}`

async function seeding() {
    await Camp.deleteMany({})
    for (let i = 0; i < 100; i++) {
        let temp = new Camp({
            title: `${descriptors[rand(18)]} ${places[rand(21)]}`,
            location: `${cities[rand(1000)].city}`,
            geometry:
            { "type" : "Point", "coordinates" : [ cities[rand(1000)].longitude, cities[rand(1000)].latitude ] },
            image: [{
             
                url: 'https://res.cloudinary.com/dpinp5laq/image/upload/v1623099384/Camp/dfjtzq9kbgvrvh1xzvhb.jpg',
                
                filename: 'Camp/dfjtzq9kbgvrvh1xzvhb'
              }]
            ,
            price:rand(2000) ,
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Inventore nesciunt hic neque recusandae, obcaecati culpa labore sunt dolorum nihil beatae est ipsam dolorem illo incidunt sint quisquam unde! Cumque, nulla?",
            author:"60baa538f367bb16546b3d35"
        })
        await temp.save()
    }

}

seeding()
    .then(() => {
        console.log("closed")
        mongoose.connection.close()
    })