require("dotenv").config({path: "../.env"});

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.MONGO_URI;

main().then(() => {
    console.log("connection successful to Cloud DB");
})
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a8039f4bc8ed83f52d60029",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();