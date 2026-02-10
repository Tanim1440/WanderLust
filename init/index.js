const mongoose=require("mongoose");
const initData=require("./data.js");
const list=require("../models/listings.js");

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

const insertData = async()=>{
    await list.deleteMany({});
    await list.insertMany(initData);
}

insertData();
