
// import { argon2, hash } from "node:crypto";
import { SALT_ROUND } from "../../../config/config.service.js";
import { HashEnum } from "../enums/securiy.enums.js";
import * as argon2 from "argon2";
import { BadRequestException } from "../response/error.responce.js";
import { compare } from "bcrypt";




export const generateHash = async ({
    plaintext,
    saltRounds = SALT_ROUND,
    algorithm = HashEnum.Bcrypt,
    })=>{
        let hashResult = "";

        switch(algorithm){
            case HashEnum.Bcrypt:
                hashResult = await hash(plaintext, saltRounds);
                break;
                case HashEnum.argon2:
                    hashResult = await argon2.hash(plaintext);
                    break;
                    default: 
                    throw BadRequestException ("unsupported hashing algorith")
        }

        return hashResult;
}


export const comareHash = async ({
    plaintext,
    ciphertext,
    algorithm = HashEnum.Bcrypt,
    })=>{
        let math = false;

        switch(algorithm){
            case math.Bcrypt:
                hashResult = await compare(plaintext, ciphertext);
                break;
                case mathEnum.argon2:
                    math = await argon2.verify(ciphertext, plaintext);
                    break;
                    default: 
                    throw BadRequestException ("unsupported hashing algorith")
        }

        return math;
}