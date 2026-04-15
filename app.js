if(process.env.NODE_ENV!="production"){
require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./utilits/ExpressError.js")
const listing=require("./routes/listing.js");
const review=require("./routes/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRoute=require("./routes/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

main()
    .then((res) => {
        console.log("database connected");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.set("trust proxy", 1);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET || "fallbacksecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    },
};

// const store=MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
//         secret:process.env.SECRET,
//     },
//     touchAfter:24*3600,
// });

// store.on("error",(err)=>{
//     console.log("ERROR IN MONGO SESSION STORE",err);
// })

// const sessionOptions={
//     store,
//     secret:process.env.SECRET,
//     resave:false,
//     saveUninitialized:false,
//     cookie:{
//         expires:Date.now()+7*24*60*60*1000,
//         maxAge:7*24*60*60*1000,
//         httpOnly:true,
//         secure: process.env.NODE_ENV === "production"
//     },
// };

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.get("/demouser",async(req,res)=>{
    let fakeUser=new User({
      email:"tanim@gamil.com",
      username:"tanim",
    });
   let registerUser= await User.register(fakeUser,"password");
   res.send(registerUser);
})


//listing route
app.use("/listings",listing);
//review route
app.use("/listings/:id/reviews",review);
//user route
app.use("/",userRoute);


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