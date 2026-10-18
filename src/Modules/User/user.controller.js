import { Router } from "express";
import * as userService from "./user.service.js"
import { authentication , authorization } from "../../Middlewares/auth.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../utils/enums/user.enum.js";

const router = Router();
router.get("/profile" , authentication({tokenType: TokenTypeEnum.ACCESS}),
authentication({accessRole:[RoleEnum.ADMIN]}),
userService.getProfile );

export default router;