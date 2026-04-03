const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utilits/wrapAsync.js")
const lists = require("../models/listings.js");
const reviews=require("../models/review.js");
const ExpressError=require("../utilits/ExpressError.js")
const {reviewSchema}=require("../schema.js");

const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
}

router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing=await lists.findById(req.params.id);
    let newReview= new reviews(req.body.review);

    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();

    res.redirect(`/listings/${listing._id}`);
}))

//review delete post route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await lists.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await reviews.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))

module.exports=router;