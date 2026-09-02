import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`⚙ Server is running at port :
            ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log(`Mongo Db connnection failed !!!`,err);
})


/*
import express from "express";
import "dotenv/config";
const app=express();
(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("Error: ",error);
            throw error
        });
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port 
                ${process.env.PORT}`);
        });
    } catch (error) {
        console.log("Error: ",error);
        throw error
    }
})();
*/
