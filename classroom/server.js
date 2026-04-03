const express = require("express");
const app = express();
const user=require("./routes/user.js");
const admin=require("./routes/admin.js");
const cookieParser =require("cookie-parser");

//use user routes
app.use("/user",user);
//use admin routes
app.use("/admin",admin);

app.use(cookieParser("secretCode"));

app.get("/getverifiedcookies",(req,res)=>{
    res.cookie("work-on","typing",{signed:true});
    res.send("verified cookies");
})
app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("verified");
})

app.get("/",(req,res)=>{
    let{name="anonymous"}=req.cookies;
    res.send(`Hi, I am ${name}`);
})

app.get("/cookies",(req,res)=>{
    res.cookie("greed","hello");
    res.send("sending cookies from server")
})

app.listen(3000,()=>{
    console.log("listening form 3000");
})