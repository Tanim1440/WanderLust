const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("you are in admin root route");
})
router.get("/:id",(req,res)=>{
    res.send("you are in admin id route");
})
router.post("/",(req,res)=>{
    res.send("you are in admin post route");
})

module.exports=router;     