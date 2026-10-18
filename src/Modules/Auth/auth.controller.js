import { Router } from "express";
import * as authService from "./auth.service.js";
import { authentication , authorization } from "../../Middlewares/auth.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../utils/enums/user.enum.js";
const router = Router();
router.post("/signup", authService.signup);
router.post("/login", authService.login);

router.post("/refresh-token", authentication({tokenType : TokenTypeEnum.REFRESH}),
authorization ({accessRoles:[RoleEnum.ADMIN , RoleEnum.USER]})
,authService.refreshToken);


router.post("/social-login",authService.loginWithGamil);

export default router;