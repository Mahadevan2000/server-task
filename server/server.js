require("dotenv").config()
const express =require("express")
const mongoose =require('mongoose')
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const UserRoutes =require("../server/app/routes/userRoute")


process.on("uncaughtException",(error)=>{
    console.log(`Error ${error.message}`)
    console.log(`shutting down the server for handling uncaugth exception`)
    process.exit(1)
})

const app =express()
const port = process.env.PORT

// Middlewares
app.use(express.json())
app.use(cookieParser())

/* prevent the data do not inject the SQL query */
app.use(mongoSanitize());

/* prevent the data  injection from javascript code */
app.use(xss());





//Routes
app.use("/api/users",UserRoutes)


// Database Connections
mongoose.connect(process.env.LOCAL_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
.then((connect)=>{
    console.log("Database Connected Successfully")
})
.catch((error)=>{
    console.log("Database Connection Error")
})



const server=app.listen(port,()=>{
    console.log(`Server is running at ${port}`)
})



process.on("unhandledRejection",(error)=>{
    console.log(error.name,error.message)
    console.log("unhandled rejection occured! shutting down...")

    server.close(()=>{
        process.exit(1)
    })
})