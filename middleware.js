const Listing = require("./models/listings.js");
const Review = require("./models/review.js");
const ExpressError=require("./utilits/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must logged in before any operation!!");
        return res.redirect("/login");
    }
    next();
}

module.exports.reachUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
    }
     next();
}

module.exports.isOwned=async(req,res,next)=>{
    let { id } = req.params;
        let listing=await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currUser._id)){
            req.flash("error","you are not the owner of this post!");
            return res.redirect(`/listings/${id}`);
        }
     next();   
}

module.exports.isReviewOwner=async(req,res,next)=>{
    let { reviewId,id } = req.params;
        let review=await Review.findById(reviewId);
          if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }
        if(!review.author.equals(res.locals.currUser._id)){
            req.flash("error","you are not the author of this review!");
            return res.redirect(`/listings/${id}`);
        }
     next();   
}

module.exports.validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
} 
