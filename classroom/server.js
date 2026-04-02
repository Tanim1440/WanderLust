const express = require("express");
const app = express();
const user=require("./routes/user.js");
const admin=require("./routes/admin.js");

//use user routes
app.use("/user",user);
//use admin routes
app.use("/admin",admin);


app.listen(3000,()=>{
    console.log("listening form 3000");
})