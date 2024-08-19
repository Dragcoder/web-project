const Listing=require("../Models/listing");
const Review =require("../Models/review");

module.exports.createReview=async(req,res)=>{
    
    let {id}=req.params;
    let listing=await Listing.findById(id);
    // console.log(listing);
    let newReview= new Review(req.body.review);
    // console.log(newReview)
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","Review is added !");
    res.redirect(`/lists/${id}`);
    
}

module.exports.deleteReview=async(req,res)=>{
    
    let {id,reviewId}=req.params;
  
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted Successfully !");
    res.redirect(`/lists/${id}`);
   
}