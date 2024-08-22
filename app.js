// server ---

if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}




const express=require("express");
const app=express();
const mongoose=require("mongoose");
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
const Listing=require("./Models/listing.js");

const cookieParser=require("cookie-parser");

app.use(methodOverride("_method"));
// 



app.set("view engine","ejs");

app.engine("ejs",ejsMate);

app.use(express.urlencoded({extended:true}));


app.use(express.static(path.join(__dirname,"/public")));

app.use(cookieParser("secretCode")); // secretCode is unquie
const flash=require("connect-flash");

const dbUrl=process.env.ATLASDB_URL;
// const dbUrl="mongodb://127.0.0.1:27017/advanture";

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
    console.log("Error in MongoSession side: ",err);
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


// define router-
app.use("/lists",listsRouter);
app.use("/lists/:id/reviews",reviewRouter);
app.use("/",userRouter);



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})



//Error handling--
app.use((err, req, res, next) => {
    // Set default values if they are undefined
    const { statusCode = 500, message = "Something went wrong!" } = err;

    res.status(statusCode).render("error.ejs", { message });
});



app.listen("8080",(req,res)=>{
    console.log("server is ready to listen on port 8080 ...");
})
