const express=require("express");
const router=express.Router();
const wrapAsync=require("../utilits/wrapAsync.js")
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utilits/ExpressError.js")
const lists = require("../models/listings.js");
const {isLoggedIn}=require("../middleware.js");



const validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}


router.get("/",wrapAsync(async (req, res) => {
    const allListings = await lists.find({});
    res.render("listings/index.ejs", { allListings })
}))
//add route
router.get("/new",isLoggedIn,(req, res) => {
    res.render("listings/new.ejs");
})

router.post("/",validateListing,isLoggedIn,wrapAsync(async (req, res, next) => {
        let newListing = req.body.listing;
        let addListing = new lists(newListing);
        addListing.owner = req.user._id;
        await addListing.save();
        req.flash("success","New listing added!");
        res.redirect("/listings");
    })
)
//edit route
router.get("/:id/edit",isLoggedIn,validateListing,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await lists.findById(id);
    if(!list){
       req.flash("error","Listing you found is not exist!!");
       return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { list });
}))
router.put("/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    if(!req.body.listing){
        throw new ExpressError(400,"Sent valid data for listing")
    }
    let updatingListing = req.body.listing;
    let updatedListing = await lists.findByIdAndUpdate(id, { ...updatingListing });
    console.log(updatingListing);
    console.log(updatedListing);
            req.flash("success","Listing edited");
    res.redirect(`/listings/${id}`);
}))

//show route
router.get("/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await lists.findById(id).populate("reviews").populate("owner");
    if(!list){
       req.flash("error","Listing you found is not exist!!");
       return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { list });
}))
//delete route
router.delete("/:id",isLoggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await lists.findByIdAndDelete(id);
     req.flash("success","Listing deleted successfully!!");
     res.redirect("/listings");
}))

module.exports=router;