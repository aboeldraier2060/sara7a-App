import nodemailer from "nodemailer";
import { USER_EMAIL, USER_PASS } from "../../../config/config.service.js";

export async function sendEmail({to = "" , subject = "" , text= "", html = "", cc="", bcc="", attachments=[], }) {
// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service:"gmail",
  auth: {
    user: USER_EMAIL,
    pass: USER_PASS,
  },
});


try {
  const info = await transporter.sendMail({
    from: `"Mahmoud sabry" <${USER_EMAIL}>`, 
    to,
    subject,
    text,
    html,
    cc,
    bcc,
    attachments,
  });
console.log("message sent: %5", info.messageId);

}catch (err) {
  console.error("Error while sending mail:", err);
  


}
};

