const express = require("express");
const app = express();
const mongoose = require("mongoose");
const lists = require("./models/listings.js");
const reviews=require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utilits/wrapAsync.js")
const ExpressError=require("./utilits/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js");
const listing=require("./routes/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then((res) => {
        console.log("database connected");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(MONGO_URL);
}



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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//listing route
app.use("/listings",listing);


//review 
//post route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing=await lists.findById(req.params.id);
    let newReview= new reviews(req.body.review);

    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();

    res.redirect(`/listings/${listing._id}`);
}))

//review delete post route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await lists.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await reviews.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}))
app.get("/", (req, res) => {
    res.send("you are in root route");
})

app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
})

app.use((err,req,res,next)=>{
    let{status=500,message="something went wrong"}=err;
    // res.status(status).send(message);
    res.render("listings/error.ejs",{message});
})

app.listen(8080, () => {
    console.log("listening from port 8080");
})