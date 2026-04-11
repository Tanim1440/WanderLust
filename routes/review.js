const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utilits/wrapAsync.js")
const {validateReview,isLoggedIn,isReviewOwner}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

//review create route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//review delete  route
router.delete("/:reviewId",isLoggedIn,isReviewOwner,wrapAsync(reviewController.destroyReview));

module.exports=router;