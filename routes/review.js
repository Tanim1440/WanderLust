const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utilits/wrapAsync.js")
const lists = require("../models/listings.js");
const reviews=require("../models/review.js");
const {validateReview,isLoggedIn,isReviewOwner}=require("../middleware.js");


router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listing=await lists.findById(req.params.id);
    let newReview= new reviews(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
        req.flash("success","New review added!");
    res.redirect(`/listings/${listing._id}`);
}))

//review delete post route
router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await lists.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await reviews.findByIdAndDelete(reviewId);
            req.flash("success","Review deleted successfully!!");
    res.redirect(`/listings/${id}`);
}))

module.exports=router;