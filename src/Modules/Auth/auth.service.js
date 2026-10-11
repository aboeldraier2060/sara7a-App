import * as dbService from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/user.model.js";
import { HashEnum } from "../../utils/enums/securiy.enums.js";
import successResponce from "../../utils/response/sucess.response.js";
import { generateHash } from "../../utils/security/hash.security.js";

export const signup = async (req , res) => {
    console.log("req body" , req.body);
    const {username , email , password , phone , gender , role , DOB} = req.body;

    const user = await dbService.findOne({model:UserModel , filter : { email }});

    if (user) {
        return res.status(409).json({ message: "user Already exist" });
    }

    //hash
    const hashPassword = await generateHash({plaintext : password , algorithm : HashEnum.argon2});

    const newUser = await UserModel.create ({
        username,
        email,
        password : hashPassword,
        phone,
        gender,
        role,
        DOB
    });

    return successResponce ({ res , message: "Done : user created" , statusCode:201 , data: { newUser }});
};

export const login = async (req , res , next) => {
    const { email , password } = req.body;

    const user = await dbService.findOne({
        model:UserModel ,
        filter : { email }
    });

    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }

    return successResponce ({ 
        res ,
        message : "done",
        statusCode : 200,
        data: { user }
    });
};