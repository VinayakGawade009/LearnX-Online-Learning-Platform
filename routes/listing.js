const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing, isInstructor} = require("../middleware.js");
const listingController = require("../Controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// Index Route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, isInstructor, listingController.renderNewForm);

// Search Route
router.get("/results", listingController.searchResults);

// Shouw Route
router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
router.post(
    "/", 
    isLoggedIn, 
    isInstructor,
    upload.single("listing[image]"), 
    validateListing, 
    wrapAsync(listingController.createListing)
);
// router.post("/", upload.single("listing[image]"), (req, res) => {
//     res.send(req.file);
// });

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update Route
router.put(
    "/:id", 
    isLoggedIn, 
    isOwner, 
    upload.single("listing[image]"), 
    validateListing, 
    wrapAsync(listingController.updateListing));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;