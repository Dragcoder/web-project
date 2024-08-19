const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../Models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const listsController=require("../controllers/lists.js");
const {isLoggedIn, isPostOwner,isValidateListing}=require("../middleware.js");

const multer  = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({storage}) // where store files in uploads folder-name


// show listings , create listing--


router
    .route("/")
    .get(wrapAsync(listsController.showLists))
    .post(isLoggedIn,upload.single('image'),wrapAsync(listsController.createList))
    

    

router
    .get("/newlist",isLoggedIn,listsController.renderNewForm)
    
router
    .get("/mountains",(listsController.showMountainsPlace));

// show listing details, updatelist, deleteList
router
    .route("/:id")
    .get(wrapAsync(listsController.showListDetails))
    .put(upload.single('image'),isValidateListing ,wrapAsync( listsController.updateList))
    .delete(isLoggedIn,isPostOwner,wrapAsync( listsController.deleteList));

router.get("/:id/update",isLoggedIn, isPostOwner,wrapAsync( listsController.renderUpdateForm))


module.exports=router;