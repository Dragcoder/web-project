const mongoose=require("mongoose");
const sampleData=require("../init/data.js");
const Listing=require("../Models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/advanture" // database name -> advanture

async function main(){
    await mongoose.connect(MONGO_URL);

}
main().then(()=>{
    console.log("connected with DB");
}).catch((er)=>console.log(er));



const initDB = async ()=>{
    // clean old data
    await Listing.deleteMany({});
    
    sampleData.data= sampleData.data.map((obj)=>({...obj,owner:"66a11f2a72ae496cfc09a85e"}));
    
    // add new data
    await Listing.insertMany(sampleData.data);
    
    console.log("data was initialize..");
}
initDB();