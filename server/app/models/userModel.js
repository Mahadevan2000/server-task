const mongoose =require("mongoose")
const bcrypt =require("bcrypt")
const validator = require("validator");


const userSchema =new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please enter your username"],
    },
email:
{
    type:String,
    required:[true,"Please enter your email"],
    unique:true,
    lowercase:true,
    validator:[validator.isEmail,"Please enter valid email"]

},

password:{
    type:String,
    required:[true,"Please enter your passsword"],
    minlength:8,
}
,

role:{
    type:String,
    enum:["admin","user"]
,
    default:"user"
}

    
}
,{ timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    this.password = await bcrypt.hash(this.password, 14);
  
    next();
  });










module.exports =  mongoose.model("User",userSchema)