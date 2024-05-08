const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");


const generateToken=(data)=>{
    return jwt.sign({data}, process.env.SECRET_KEY,{ expiresIn: "30d" })
}



const verifyToken = async (req, res, next) => {
    const token = req.cookies["token"];

    if (!token) {
        return res.status(401).json({message:"Access denied, token missing"})
    }


    try {
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);

        let user = await userModel.findById(decoded.data.id);

        if (!user) {

        return res.status(404).json({message:"User Not found"})

        }

        req.user = user;
        next();
    } catch (error) {
        // Handle JWT verification errors

        return res.status(500).json({message:"Invalid token"})


    }
}

const restrict =(...role)=>{
    return (req,res,next)=>{
        if(!role.includes(req.user.role)){

        return res.status(404).json({message:"Your don't have permission to perform this action"})
            

        }

        next()
    }
}

module.exports = {  generateToken ,verifyToken,restrict};
