const express=require("express");
const router=express.Router();
const wrapAsync=require("../utilits/wrapAsync.js")
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utilits/ExpressError.js")
const lists = require("../models/listings.js");



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
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
})

router.post("/",validateListing,wrapAsync(async (req, res, next) => {
        let newListing = req.body.listing;
        let addListing = new lists(newListing);
        await addListing.save()
        res.redirect("/listings");
    })
)
//edit route
router.get("/:id/edit",validateListing,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await lists.findById(id);
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
    res.redirect(`/listings/${id}`);
}))

//show route
router.get("/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await lists.findById(id).populate("reviews");
    res.render("listings/show.ejs", { list });
}))
//delete route
router.delete("/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await lists.findByIdAndDelete(id);
    res.redirect("/listings");
}))

module.exports=router;