import { authRouter, messageRouter, userRouter } from "./Modules/index.js";
import successResponce from "./utils/response/sucess.response.js";
import { BadRequestException} from "./utils/response/error.responce.js";
import connectDB from "./DB/connection.js"
import cors from "cors"
import { sendEmail } from "./utils/email/nodemailer.email.js";

const bootstarp = async (app, express) =>{
    app.use(express.json() , cors())

    await connectDB();

    app.get ("/", (req, res)=>{
        successResponce({res , statusCode:200 , message: "Hello from Sara7a App"});
    });

    await sendEmail({to: "mahmoudibrahim1812005@gamil.com" , text : "Hello from Sara7a App"})

    app.use("/api/v1/auth", authRouter)
    app.use("/api/v1/user", userRouter)
    app.use("/api/v1/messages", messageRouter)


    app.all("/*dummy" , (req,res)=>{
        throw BadRequestException(
            {message : "Not Found"}
        )
        app.use(globalErrorHandler);
    });

};

export default bootstarp;