const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utilits/ExpressError.js")
const listing=require("./routes/listing.js");
const review=require("./routes/review.js");

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





app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//listing route
app.use("/listings",listing);
//review route
app.use("/listings/:id/reviews",review);

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