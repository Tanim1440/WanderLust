const Listing=require("../models/listings")

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}

module.exports.newListingFrom= (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.postNewListing=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing = req.body.listing;
    let addListing = new Listing(newListing);
    addListing.owner = req.user._id;
    addListing.image={url,filename};
    await addListing.save();
    req.flash("success", "New listing added!");
    res.redirect("/listings");
}

module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
        req.flash("error", "Listing you found is not exist!!");
        return res.redirect("/listings");
    }
    let originalImageUrl=list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { list, originalImageUrl });
}

module.exports.putEditListing=async (req, res) => {
    let { id } = req.params;
    let updatingListing = req.body.listing;
    let updatedListing = await Listing.findByIdAndUpdate(id, { ...updatingListing });
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        updatedListing.image={url,filename};
        await updatedListing.save();
    }
    req.flash("success", "Listing edited");
    res.redirect(`/listings/${id}`);
}

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("owner");
    if (!list) {
        req.flash("error", "Listing you found is not exist!!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { list });
}

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!!");
    res.redirect("/listings");
}