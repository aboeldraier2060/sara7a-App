import { Router } from "express";
import * as authService from "./auth.service.js";
import { authentication , authorization } from "../../Middlewares/auth.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../utils/enums/user.enum.js";
import { auth } from "google-auth-library";
const router = Router();
router.post("/signup", authService.signup);
router.post("/login", authService.login);
router.patch("/confirm-email", authService.confirmEmail);

router.patch("/forget-password", authService.forgetpassword);

router.patch("/reset-password", authService.resetpassword);



router.post("/refresh-token", authentication({tokenType : TokenTypeEnum.REFRESH}),
authorization ({accessRoles:[RoleEnum.ADMIN , RoleEnum.USER]})
,authService.refreshToken);

router.post("/logout" , authentication({tokenType:TokenTypeEnum.ACCESS}) , authorization({accessRoles: [RoleEnum.ADMIN , RoleEnum.USER]}),
authService.logout
)

router.post("/social-login",authService.loginWithGamil);

export default router;