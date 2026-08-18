const User = require("../models/user.js");
const tags = require("../tags.js");

module.exports.renderSignupForm = (req, res) => {
    // Save the previous page URL so they return there after signing up
    const referer = req.headers.referer;
    if (referer && !referer.includes('/login') && !referer.includes('/signup')) {
        req.session.redirectUrl = referer;
    }
    res.render("users/signup");
};

module.exports.signup =  async (req, res, next) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        let redirectUrl = req.session.redirectUrl || "/listings";
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Codee!");

            // Redirect back to previous page, or default to /listings
            res.redirect(redirectUrl);
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    // Save the previous page URL so they return there after logging in
    const referer = req.headers.referer;
    if (referer && !referer.includes('/login') && !referer.includes('/signup')) {
        req.session.redirectUrl = referer;
    }
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Codee!");
    // Uses res.locals.redirectUrl set by your saveRedirectUrl middleware!
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); // req.originalUrl
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    });
};

module.exports.renderVerifyForm = (req, res) => {
    res.render("users/verify.ejs", { tags });
};