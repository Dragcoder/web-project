// server ---

if(process.env.MODE_ENV !="production"){
    require('dotenv').config() // to help access .env file data
}


const port="0000";
const express=require("express");
const app=express();
const mongoose=require("mongoose");
app.set("view engine","ejs");
const ejsMate=require("ejs-mate");

const ExpressError=require("./utils/ExpressError.js");
const path=require("path")
const methodOverride =require("method-override");
const session=require("express-session");
const MongoStore=require("connect-mongo");

const listsRouter=require("./routes/lists.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const passport=require("passport");
const LocalStrategy=require("passport-local")
const modelUser=require("./Models/user.js");


const cookieParser=require("cookie-parser");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));




app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use(cookieParser("secretCode")); // secretCode is unquie
const flash=require("connect-flash");

const dbUrl=process.env.ATLASDB_URL;

async function main(){
    await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("connected with DB");
}).catch((er)=>console.log(er));

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600
})
store.on("error",(err)=>{
    console.log("Error in MongoSession",err);
})

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000, // expires date = next 7 days from 23/7/2024
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}



app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(modelUser.authenticate()));
passport.serializeUser(modelUser.serializeUser());
passport.deserializeUser(modelUser.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success"); // res.locals.success it is array -->[]
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user; // current user info. // it will access in ejs by name currentUser.
    next();
})


app.use("/",listsRouter); // it is use to show DATA--

app.use("/lists/:id/reviews",reviewRouter); // it is working on review (Add,delete)- 
                                        // here :id is params-- this will not send to review file so for this use mergParams:true;
app.use("/",userRouter);




app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})


//Error handling--
app.use((err,req,res,next)=>{
    let {statusCode,message}=err;
    res.status(statusCode).render("error.ejs",{message});
   

})


app.listen(port,(req,res)=>{
    console.log("server is ready to listen on port 8080 ...");
})
