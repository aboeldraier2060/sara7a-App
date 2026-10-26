import jwt from "jsonwebtoken";
import { JWT_ADMIN_SECRET_ACCESS, JWT_ADMIN_SECRET_REFRESH, JWT_USER_SECRET_ACCESS, JWT_USER_SECRET_REFRESH, JWT_EXPIRES_IN_ACCESS, JWT_EXPIRES_IN_REFRESH } from "../../../config/config.service.js";
import { RoleEnum, SignatureEnum, TokenTypeEnum } from "../enums/user.enum.js";
import { BadRequestException, NotFoundException } from "../response/error.responce.js";
import { findById, findOne } from "../../DB/database.repository.js";
import UserModel from "../../DB/Models/user.model.js";
import {v4 as uuid} from "uuid";
import TokenModel from "../../DB/Models/token.model.js";

export const generateToken = ({ payload, secretKey, options }) => {
    return jwt.sign(payload, secretKey, options);
};

export const verifyToken = ({ token, secretKey }) => {
    return jwt.verify(token, secretKey);
};

export const getSignature = ({ signatureLevel = SignatureEnum.USER } = {}) => {
    let signatureObj = { accessSignature: undefined, refreshSignature: undefined };

    switch (signatureLevel) {
        case SignatureEnum.ADMIN:
            signatureObj.accessSignature = JWT_ADMIN_SECRET_ACCESS;
            signatureObj.refreshSignature = JWT_ADMIN_SECRET_REFRESH;
            break;

        case SignatureEnum.USER:
        default:
            signatureObj.accessSignature = JWT_USER_SECRET_ACCESS;
            signatureObj.refreshSignature = JWT_USER_SECRET_REFRESH;
            break;
    }

    return signatureObj;
};

export const getNewLoginCredentials = async (user) => {
    const signature = await getSignature({
        signatureLevel: user.role === RoleEnum.ADMIN ? SignatureEnum.ADMIN : SignatureEnum.USER
    });

    const jwtid = uuid()

    console.log(signature);

    const accessToken = generateToken({
        payload: { id: user._id },
        secretKey: signature.accessSignature,
        options: { expiresIn: JWT_EXPIRES_IN_ACCESS , jwtid }
    });

    const refreshToken = generateToken({
        payload: { id: user._id },
        secretKey: signature.refreshSignature,
        options: { expiresIn: JWT_EXPIRES_IN_REFRESH , jwtid }
    });

    return {
        accessToken,
        refreshToken
    };
};

export const decodedToken = async ({ authorization, tokenType = TokenTypeEnum.ACCESS }) => {
    if (!authorization || typeof authorization !== "string") {
        throw BadRequestException({ message: "authorization header is missing or invalid" });
    }

    const parts = authorization.split(" ");
    if (parts.length !== 2) {
        throw BadRequestException({ message: "invalid token format" });
    }

    const [Bearer, token] = parts;
    if (!Bearer || !token) {
        throw BadRequestException({ message: "invalid token" });
    }

    let signature = await getSignature({
        signatureLevel: Bearer === "ADMIN" ? SignatureEnum.ADMIN : SignatureEnum.USER,
    });

    const decoded = verifyToken({
        token,
        secretKey:
            tokenType === TokenTypeEnum.ACCESS
                ? signature.accessSignature
                : signature.refreshSignature,
    });
    const isRevoked = await findOne({model: TokenModel , filter: {jti:decoded.jti}});
    if(isRevoked) throw BadRequestException({message:"Token is revoked , please login again"})

    const user = await findById({ model: UserModel, id: decoded.id });

    if (!user) throw NotFoundException({ message: "user Not Found" });
    if (user.chachangeCredentialTime?.gitTime() || 0 > decoded.iat * 1000)
        throw BadRequestException({message:"Login again"})

    return {
        user,
        decoded,
    };
};