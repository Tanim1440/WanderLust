const express=require("express");
const app=express();
const mongoose=require("mongoose");
const lists=require("./models/listings.js");
const path=require ("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
  .then((res)=>{
    console.log("database connected");
  })
  .catch((err)=>{
    console.log(err);
  })

async function main(){
    await mongoose.connect(MONGO_URL);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//index route
app.get("/listings",async (req,res)=>{
    const allListings= await lists.find();
    res.render("listings/index.ejs",{allListings})
})
//add route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.post("/listings",async(req,res)=>{
    let newListing=req.body.listing;
    let addListing=  new lists(newListing);
    await addListing.save()
    res.redirect("/listings");
})
//edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    let list=await lists.findById(id);
    res.render("listings/edit.ejs",{list});
})
app.put("/listings/:id",async (req,res)=>{
    let{id}=req.params;
    let updatingListing=req.body.listing;
    let updatedListing=await lists.findByIdAndUpdate(id,{...updatingListing});
    console.log(updatingListing);
    console.log(updatedListing);
    res.redirect(`/listings/${id}`);
})

//show route
app.get("/listings/:id",async (req,res)=>{
    let{id}=req.params;
    let list=await lists.findById(id);
    res.render("listings/show.ejs",{list});
})
//delete route
app.delete("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    let deletedListing=await lists.findByIdAndDelete(id);
    res.redirect("/listings");
})

app.get("/",(req,res)=>{
    res.send("you are in root route");
})
app.listen(8080,()=>{
    console.log("listening from port 8080");
})