const User=require("../Models/user");

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser= new User({email,username});
        let registerUser=await User.register(newUser,password);
        
        console.log("from signup: "+registerUser);

        req.login(registerUser,(error)=>{
            if(error){
                return next(error);
            }
            req.flash("success","Registered Successfully !");
            res.redirect("/lists"); 
        })
       
    }
    
    catch(error){
            req.flash("error",error.message);
            res.redirect("/signup");
    }
}

module.exports.login=async(req,res)=>{
       
    req.flash("success","Successfully login !");
 
    // pending....
    let {id}=req.params;
    
    let redirectUrl = res.locals.redirectUrl || "/";
    
   
    res.redirect(redirectUrl);
  
   

}

module.exports.logout=(req,res)=>{
    req.logout((error)=>{
        if(error){
            return next(error);
        }
        req.flash("success","you are logged out !");
        res.redirect("/");
    })
}

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}