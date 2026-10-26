import multer from "multer";
import path from "node:path";

export const localFileUpload = () =>{

    const storage = multer.diskStorage({
        destination : (req , file,cb) =>{
            cb(null , path.resolve("./uploads"))


        },
        filename : (req , file , cb) =>{
            const uniceFileName = Date.now() + "__"+ Math.random() + "__" + file.originalname
            cb(null , uniceFileName)

        }
    })
    return multer({storage})
}
