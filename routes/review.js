const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utilis/wrapAsync.js");
const ExpressError = require("../utilis/ExpressError.js");
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");


//Reviews
//Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.addReview));

//Delete Review route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;