const Listing=require("./Models/listing.js");
const Review =require("./Models/review.js");
const { listingSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){ // isAuthenticated return true/false--
       
        let {id}=req.params; // current listingId
       
        req.session.listingId=id;
        // console.log(req.session);
        req.flash("error","you must be logged In");
        return res.redirect(`/login`);
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        console.log("from saveRedirectUrl"+res.locals.redirectUrl);
       
    }
    next();
}

module.exports.isPostOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing =await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser.id)){
        req.flash("error","you don't have permission to update or Delete");
        return res.redirect(`/lists/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    
  
    // here id == [current listing id] 
    let {id,reviewId}=req.params;
   

    let review =await Review.findById(reviewId);
   
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","you are not author of this review !!");
        return res.redirect(`/lists/${id}`);
    }
    
    next();
}

// Validation of data--
module.exports.isValidateListing =(req,res,next)=>{
    
    let {error}=listingSchema.validate(req.body);
    console.log("form isValidateListing",req.body);
    
    if(error){
        throw new ExpressError(400,error);
    }
    else{ 
        next();
    }

}

