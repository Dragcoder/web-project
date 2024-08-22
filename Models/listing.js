const mongoose=require("mongoose");
const Review=require("./review.js");
const User=require("./user.js");


const listingSchema=new mongoose.Schema({
    title:
    {
        type:String,
        required:true
    },

    description:{
        type:String,
       
    },
    
    image:{
           url: String,
           filename:String,
            
    },

    price:{
        type:Number,
        
    },

    location:String,
    country:String,
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }
    ],

    owner: // owner of the listing/posts
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        },

    category:{
        type:String,
        
        // enum:["mountains","artics","farms","deserts"]
    }
})


// delete middleware--
listingSchema.post("findOneAndDelete" , async(lists)=>{
    if(lists){
        await Review.deleteMany({_id: {$in: lists.reviews}});
    }
});


const listingCollection=mongoose.model("Listing",listingSchema);

module.exports=listingCollection;

