import { model } from "mongoose";
import { CLIENT_ID } from "../../../config/config.service.js";
import * as dbService from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/user.model.js";
import { HashEnum } from "../../utils/enums/securiy.enums.js";
import { ProviderEnum } from "../../utils/enums/user.enum.js";
import { BadRequestException } from "../../utils/response/error.responce.js";
import successResponce from "../../utils/response/sucess.response.js";
import { generateHash } from "../../utils/security/hash.security.js";
import { getNewLoginCredentials } from "../../utils/token/token.js";
import {OAuth2Client} from "google-auth-library"

export const signup = async (req, res) => {
    console.log("req body", req.body);
    const { username, email, password, phone, gender, role, DOB } = req.body;

    const user = await dbService.findOne({ model: UserModel, filter: { email } });

    if (user) {
        return res.status(409).json({ message: "User already exists" });
    }

    // Hash Password
    const hashPassword = await generateHash({ plaintext: password, algorithm: HashEnum.argon2 });

    const newUser = await UserModel.create({
        username,
        email,
        password: hashPassword,
        phone,
        gender,
        role,
        DOB
    });

    return successResponce({ res, message: "Done : user created", statusCode: 201, data: { newUser } });
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await dbService.findOne({
        model: UserModel,
        filter: { email }
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }


    const tokens = await getNewLoginCredentials(user);

    return successResponce({
        res,
        message: "Done",
        statusCode: 200,
        data: { tokens }
    });
};

export const refreshToken = async (req , res) =>{
    const tokens = await getNewLoginCredentials(req.user);

    successResponce({res , message: "done" , data:{tokens}})

    
};

async function verifyGoogleAccount({idToken}) {
const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
      idToken,
      audience:CLIENT_ID, 
  });
  const payload = ticket.getPayload();

  return payload;
}


export const loginWithGamil = async (req , res)=>{

    const {idToken} = req.body

    const {email , picture , given_name , family_name , email_verified} = await verifyIdToken({idToken});

    if (!email_verified) throw BadRequestException({message: "Email not verfied"});

    const user = await dbService.findOne({model:UserModel , filter:{email}})

    if (user) {
        if(user.provider === ProviderEnum.GOOGLE) {
            const tokens = await getNewLoginCredentials(user)

            successResponce({res , message:"Done" , data: {tokens}});
        }else {
            const newUser = await dbService.create({model:UserModel , data: [{
                firstName:given_name,
                lastName : family_name,
                email,
                profilePic : picture,
                provider :ProviderEnum.GOOGLE
            }
            ]});
              const tokens = await getNewLoginCredentials(newUser)

            successResponce({res , message:"Done", statusCode:201 , data: {tokens}});
        }
    }



}