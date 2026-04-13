const mongoose=require("mongoose");
const reviews = require("./review");
const user=require("./user");
const { listingSchema } = require("../schema");
const schema=mongoose.Schema;

const listSchema=new schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:schema.Types.ObjectId,
            ref:"review"
        }
    ],
    owner:{
        type:schema.Types.ObjectId,
        ref:"User"
    },
})

listSchema.post("findOneAndDelete",async(listing)=>{
   if(listing){
    await reviews.deleteMany({_id:{$in:listing.reviews}});
   }
})

let list=mongoose.model("list",listSchema);
module.exports=list;