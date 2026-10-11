import mongoose, { Mongoose } from "mongoose";
import { DB_URI } from "../../config/config.service.js";
const connectDB = async () =>{
    try{
        mongoose.connection.on("connected" ,()=>{
            console.log("mongoDB connected succ");
            
        })
        mongoose.connect(DB_URI, {
            serverSelectionTimeoutMS : 5000
        })
    }catch (error) {
        console.log("error data" , error);

    }

};
export default connectDB;