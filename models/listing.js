const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    image:{
        url: String,
        filename: String,
    },
    price:{
        type: Number,
        default: 0,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    country:{
        type: String
    },
    latitude:{
        type: Number,
    },
    longitude:{
        type: Number,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
],
owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
},
});

//mongoose middleware (when we delete listing then reviews will also delete with help of this middleware)
listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
