import { EventEmitter } from "node:events";
import { sendEmail } from "../email/nodemailer.email.js";
import { emailSupject } from "../enums/email.enums.js";

export const emailEvent = new EventEmitter();

emailEvent.on("confirmEmail" , async (data)=>{
    await sendEmail({
        to : data.to,
        subject : emailSupject.confirmEmail
    })
});