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

const validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
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

//index route
app.get("/listings",wrapAsync(async (req, res) => {
    const allListings = await lists.find({});
    res.render("listings/index.ejs", { allListings })
}))
//add route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

app.post("/listings",validateListing,wrapAsync(async (req, res, next) => {
        let newListing = req.body.listing;
        let addListing = new lists(newListing);
        await addListing.save()
        res.redirect("/listings");
    })
)
//edit route
app.get("/listings/:id/edit",validateListing,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await lists.findById(id);
    res.render("listings/edit.ejs", { list });
}))
app.put("/listings/:id",wrapAsync(async (req, res) => {
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
app.get("/listings/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await lists.findById(id);
    res.render("listings/show.ejs", { list });
}))
//delete route
app.delete("/listings/:id",wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await lists.findByIdAndDelete(id);
    res.redirect("/listings");
}))

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