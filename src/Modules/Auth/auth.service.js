import { CLIENT_ID } from "../../../config/config.service.js";
import * as dbService from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/user.model.js";
import { HashEnum } from "../../utils/enums/securiy.enums.js";
import { LogoutTypeEnum, ProviderEnum } from "../../utils/enums/user.enum.js";
import { BadRequestException } from "../../utils/response/error.responce.js";
import successResponce from "../../utils/response/sucess.response.js";
import { comareHash, generateHash } from "../../utils/security/hash.security.js";
import { getNewLoginCredentials } from "../../utils/token/token.js";
import { OAuth2Client } from "google-auth-library";
import { emailEvent } from "../../utils/events/email.events.js";
import { generateOTP } from "../../utils/token/genereateOTP.js";
import TokenModel from "../../DB/Models/token.model.js";
import { model } from "mongoose";

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

    // sendEmail
    emailEvent.emit("confirmEmail", { to: email, firstName: username });

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

export const confirmEmail = async (req, res) => {
    const { email, otp } = req.body;

    const user = await dbService.findOneAndUpdate({
        model: UserModel,
        filter: { email, confirmEmail: { $exists: false } },
        data: { confirmEmail: true }
    });

    if (!user) {
        throw BadRequestException({ message: "invalid account" });
    }

    return successResponce({ res, message: "Email confirmed successfully", statusCode: 200 });
};

export const refreshToken = async (req, res) => {
    const tokens = await getNewLoginCredentials(req.user);

    successResponce({ res, message: "done", data: { tokens } });
};

async function verifyGoogleAccount({ idToken }) {
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
        idToken,
        audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();

    return payload;
}

export const loginWithGamil = async (req, res) => {
    const { idToken } = req.body;

    const { email, picture, given_name, family_name, email_verified } = await verifyGoogleAccount({ idToken });

    if (!email_verified) throw BadRequestException({ message: "Email not verfied" });

    const user = await dbService.findOne({ model: UserModel, filter: { email } });

    if (user) {
        if (user.provider === ProviderEnum.GOOGLE) {
            const tokens = await getNewLoginCredentials(user);

            successResponce({ res, message: "Done", data: { tokens } });
        } else {
            const newUser = await dbService.create({
                model: UserModel,
                data: [{
                    firstName: given_name,
                    lastName: family_name,
                    email,
                    profilePic: picture,
                    provider: ProviderEnum.GOOGLE
                }]
            });
            const tokens = await getNewLoginCredentials(newUser);

            successResponce({ res, message: "Done", statusCode: 201, data: { tokens } });
        }
    }
};

export const forgetpassword = async (req, res) => {
    const { email } = req.body;
    
    const otp = generateOTP();
    const hashedOTP = await generateHash({ plaintext: String(otp), algorithm: HashEnum.argon2 });

    const user = await dbService.findOneAndUpdate({
        model: UserModel,
        filter: { email, provider: ProviderEnum.SYSTEM, confirmEmail: { $exists: true } },
        data: {
            forgetpasswordOtp: hashedOTP,
        }
    });

    if (!user) throw BadRequestException({ message: "invalid Account" });

    emailEvent.emit("forgetPassword", {
        to: email,
        otp,
        firstName: user.firstName,
    });

    return successResponce({ res, message: "check your inbox" });
};

export const resetpassword = async (req , res) => {
    const { email , otp , newPassword} = req.body

    const user = await dbService.findOne({model:UserModel , filter: {email , provider: ProviderEnum.SYSTEM,
        confirmEmail : {$exists: true},
        forgetpasswordOtp: {$exists: true}
    }});
    if (!user) throw BadRequestException({message : "invaled account"})

        const isOtpValid = await comareHash({plaintext: otp , ciphertext:user.forgetpasswordOtp , algo :HashEnum.Argon});
         if (!isOtpValid) throw BadRequestException({message : "invaled otp"});

         const hashPassword = await generateHash({plaintext:newPassword , algo : HashEnum.Argon})

         await dbService.updateOne({module: UserModel , filter: {email} , update: {password: hashPassword , $unset: {forgetpasswordOtp:true}}})

         successResponce({res , message: "Done"})
    }

    export const logout = async (req , res) =>{
        const {flag} = req.query;
        let status = 200;
        switch(flag) {
            case LogoutTypeEnum.Logout:
                await dbService.create({
                    module : TokenModel,
                    data : [
                        {
                            jti : req.decoded.jti,
                            userId : req.user._id,
                            expiresIn : Data.now() - req.decoded.exp,
                        },
                    ],
                });
                status = 201;
                break;
                case LogoutTypeEnum.LOGOUTFROMALL:
                    await dbService.updateOne({model: UserModel , filter : {_id:req.user._id}, update : {changeCredentialTime:Date.now()},});
                    break;
        }
        successResponce({res , message : "Logout success" , statusCode:status})
    }
