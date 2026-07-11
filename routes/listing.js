const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utilis/wrapAsync.js");
const { validateListing, isLoggedIn, isOwner, saveRedirectUrl } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage}); //multer bydefault will store image in cloudinary storage


router.route("/")
.get(wrapAsync(listingController.index)) //index route
.post(
    isLoggedIn,  
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
); //create route


//new Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(
    wrapAsync(listingController.showListing)
) //show route
.put(isLoggedIn,
    isOwner, 
    upload.single('listing[image]'), 
    validateListing, 
    wrapAsync(listingController.updateListing)
) //update route
.delete(isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.deleteListing)
); //delete route


//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

router.post("/:id/reserve", isLoggedIn, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    console.log(listing);
    req.flash("success", `🎉 Booking confirmed for "${listing.title}"! The host will contact you shortly.`);
    res.redirect(`/listings/${req.params.id}`);
}));


module.exports = router;