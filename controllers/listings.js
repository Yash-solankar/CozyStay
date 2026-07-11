const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ 
            path: "reviews", 
            populate: { path: "author" } 
        })
        .populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    
    // console.log(listing);
    // Pass currentUser to the template
    res.render("listings/show.ejs", { 
        listing,
        currentUser: req.user  // Add this line
    });
}

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {
        url: req.file.path,
        filename: req.file.filename
    }

    //Get coordinate from OpenStreetMap(Nominatim)
    const address = `${newListing.location}, ${newListing.country}`;
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
        {
            headers: {
                "User-Agent": "CozyStay/1.0"
            }
        }
    );

    const data = await response.json();
    if(data.length>0){
        newListing.latitude = parseFloat(data[0].lat);
        newListing.longitude = parseFloat(data[0].lon);
    }

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing});
}

// module.exports.updateListing = async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     if(typeof req.file !== "undefined"){
//             listing.image = {
//             url: req.file.path,
//             filename: req.file.filename
//         }
//     await listing.save();
//     }
//     req.flash("success", "Updated!");
//     res.redirect(`/listings/${id}`);
// }
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);

    // Update all listing fields
    Object.assign(listing, req.body.listing);

    // Get updated coordinates from OpenStreetMap
    const address = `${listing.location}, ${listing.country}`;
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
        {
            headers: {
                "User-Agent": "CozyStay/1.0"
            }
        }
    );

    const data = await response.json();

    if (data.length > 0) {
        listing.latitude = parseFloat(data[0].lat);
        listing.longitude = parseFloat(data[0].lon);
    }

    // Update image if a new image is uploaded
    if (typeof req.file !== "undefined") {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();

    req.flash("success", "Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}