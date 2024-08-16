const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const passportLocalMongoose=require("passport-local-mongoose"); // passport-local-mongoose will add username, hash and salt field to store username,the hashed password and the salt value.

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
    // username and password created by passport-local=mongoose

})

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);