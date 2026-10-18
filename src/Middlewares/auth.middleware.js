import { TokenTypeEnum } from "../utils/enums/user.enum.js";
import { decodedToken } from "../utils/token/token.js";

export const authentication = ({tokenType = TokenTypeEnum.ACCESS}) => {
    return async (req , res , next) => {

        const {user , decoded} = await decodedToken({authorization:req.headers.authorization,
            tokenType,
        });
        req.user = user;
        req.decoded = decoded;

        return next();

    };
};


export const authorization = ({ accessRoles= ["ADMIN" , "USER", "SUPERADMIN"]}) => {
    return async (req , res , next) => {

        if (!accessRoles.includes(req.user.role))
            throw ForbiddenException({message : "unauthorized Access"});

        return next();

    };
};