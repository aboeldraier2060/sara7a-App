import { Router } from "express";
import * as userService from "./user.service.js"
import { authentication , authorization } from "../../Middlewares/auth.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../utils/enums/user.enum.js";
import { localFileUpload } from "../../utils/multer/local.multer.js";

const router = Router();
router.get("/profile" , authentication({tokenType: TokenTypeEnum.ACCESS}),
authentication({accessRole:[RoleEnum.ADMIN]}),
userService.getProfile );

router.patch("/update-profile-pic" , 
//     authentication({tokenType: TokenTypeEnum.ACCESS}),
// authentication({accessRole:[RoleEnum.ADMIN]}),
localFileUpload().single("attachments"),
userService.uploadProfilepic );

export default router;