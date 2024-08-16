
const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");
app.set("view engine","ejs");
const path=require("path");

app.set("views",path.join(__dirname,"views"));

const sessionOptions={
    secret: "mysupersecretstring",
}

app.use(session(sessionOptions)); // this session id's create for each and every route--
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name === "anonymous"){
        req.flash("error","user not register");
    }
    else{
        req.flash("success","user register successfully");
    }

    // req.flash("success","user register successfully");
    // req.flash("error","user not register");
    // console.log(req.session.name);
    // console.log(req.session);
    res.redirect("/hello");

})

app.get("/hello",(req,res)=>{
   
    res.render("page.ejs",{name:req.session.name});
})

// app.get("/test",(req,res)=>{
//     res.send("test successful !");
// });


// app.get("/reqcount",(req,res)=>{

//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1; // it store in temp. Memory
//     }

    
//     res.send(`you sent a request ${req.session.count} times`);
// })





app.listen("8080",(req,res)=>{
    console.log("server is ready to listen...");
})