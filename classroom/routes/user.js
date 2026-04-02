const express=require("express");
const router= express.Router();

router.get("/",(req,res)=>{
    res.send("you are in root route");
})
router.get("/:id",(req,res)=>{
    res.send("you are in id route");
})
router.post("/",(req,res)=>{
    res.send("you are in post route");
})

module.exports=router;