if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

// console.log(process.env.SECRET);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.MONGO_URI;

main().then(() => {
    console.log("connection successful");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
    secret: "mysecretecode", 
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now + 7 * 24 * 60 * 60 * 1000, // till 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// app.get("/", (req, res) => {
//     res.send("Ani");
// });

app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeuser = new User({
//         email: "student@gmail.com",
//         username: "student",
//     })

//     let registeredUser = await User.register(fakeuser, "helloworld");
//     res.send(registeredUser) ; 
// })

app.use("/listings", listingRouter); // listing routes

app.use("/listings/:id/reviews", reviewRouter); // review routes

app.use("/", userRouter); // review routes

// app.get("/test", async(req, res) => {
//     let sampleListing = new Listing ({
//         title: "Python Basics",
//         description: "Description of Python Basics Course.",
//         tag: "Python",
//         state: "recorded",
//         language: "english",
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("sampleListing is saved");
// });

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="Someth/ing Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});