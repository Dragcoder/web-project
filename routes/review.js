const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../Models/listing.js");
const Review =require("../Models/review.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn, isPostOwner, isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

// validation for review--
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    console.log(error)
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}


// create review route--

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


// [delete Review] route--
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync (reviewController.deleteReview))

module.exports=router;