const UserModel = require("../models/userModel");
const {generateToken} =require("../middleware/auth")
const bcrypt =require("bcrypt")

class UserController {
  async registerUser(req, res, next) {

    const {email,password,username}=req.body
    try {

      
      const missingFieldErrors = {
        email: "Please provide an email",
        password: "Please provide a password",
        username: "Please provide a username"
      };
    
      const missingField = Object.keys(missingFieldErrors).find(field => !req.body[field]);
    
      if (missingField) {
        return res.status(400).json({ message: missingFieldErrors[missingField] });
      }
      const isEmailExsit = await UserModel.findOne({ email: req.body.email });

      if (isEmailExsit) {

      return res.status(409).json({message:"Email is Already Exist"})

       
      }
      const userCreate = await UserModel.create(req.body);

      res.status(200).json({ message: "Registed Successfully",data:userCreate });
    } catch (error) {
      return (res.status(500).json({message:"Internal server error" ,error:error}))

    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {

        return res.status(400).json({message:"provide the email or password"})

    
      }
      const emailExist = await UserModel.findOne({ email: req.body.email });

      if (!emailExist) {
        return res.status(404).json({message:"Email Does not Exist"})

       
      }


      const passwordMacth =await bcrypt.compare(password,emailExist.password)


      if (!passwordMacth) {
        
        return res.status(400).json({message:"Incorrect Password"})

      }

      let data = {
        id: emailExist._id,
      };

      const token = generateToken(data);

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "development",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          message: "Login Successfully",
            data:token 
        });
    } catch (error) {

      return res.status(500).json({message:"Internal server error"})
 

    }
  }

  async getAllUsers(req,res,next){
      try{

        const allUser = await UserModel.find().sort({ createdAt: -1 }).select("-__v");

        
        const usernames = allUser.map(user => user.username); 
        res.status(200).json({message:"All Users ", usernames:usernames });
      }
      catch(error){
        
        return res.status(500).json({message:"Invalid token"})


      }


   

  }
}

module.exports = { UserController };
