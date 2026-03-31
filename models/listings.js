const mongoose=require("mongoose");
const reviews = require("./review");
const { listingSchema } = require("../schema");
const schema=mongoose.Schema;

const listSchema=new schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        type:String,
        default:"https://plus.unsplash.com/premium_photo-1738779001856-61660b4ebeec?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=> v===""?"https://plus.unsplash.com/premium_photo-1738779001856-61660b4ebeec?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        :v,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:"review"
        }
    ]
})

listSchema.post("findOneAndDelete",async(listing)=>{
   if(listing){
    await reviews.deleteMany({_id:{$in:listing.reviews}});
   }
})

let list=mongoose.model("list",listSchema);
module.exports=list;