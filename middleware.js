const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utilis/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");  //Joi


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        if (req.method === "POST" && req.originalUrl.endsWith("/reserve")) {
            // Send user back to the listing page after login
            req.session.redirectUrl = `/listings/${req.params.id}`;
            req.session.action = "reserve";
            req.flash("error", "Please log in to reserve this stay.");
        } else {
            req.session.redirectUrl = req.originalUrl;
            req.flash("error", "You must be logged in to create a listing.");
        }

        return res.redirect("/login");
    }

    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    if (req.session.action) {
        res.locals.action = req.session.action;
    }

    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}