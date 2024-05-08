const express =require ("express")

const routes =express.Router()

const {verifyToken,restrict} =require("../middleware/auth")
const {UserController} =require("../controllers/userController")

const {registerUser,login,getAllUsers}=new UserController()

const asyncErrorHandler =require("../utils/asyncErrorHandler")


    
routes.route("/register").post(asyncErrorHandler(registerUser))
routes.route("/login").post(asyncErrorHandler(login))

routes.route("/getAllUsers").get(verifyToken,restrict("admin","user"),asyncErrorHandler(getAllUsers))









module.exports =routes