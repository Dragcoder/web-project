
const express=require("express");
const router=express.Router({mergeParams:true});
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const usersController=require("../controllers/usres");
const wrapAsync = require("../utils/wrapAsync");

router
    .route("/signup")
    .get(usersController.renderSignupForm)
    .post(wrapAsync(usersController.signup));


router
    .route("/login")
    .get((req,res)=>{res.render("users/login.ejs") })
    .post(saveRedirectUrl,passport.authenticate("local",
        {failureRedirect:"/login",
        failureFlash:true}),
        usersController.login);    

router.get("/logout",usersController.logout);


module.exports=router;

