import { NextFunction, Request, Response, Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router();

router.post("/login", AuthController.credentialsLogin)
router.post("/refresh-token", AuthController.getNewAccessToken)
router.post("/logout", AuthController.logout)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthController.resetPassword)
// booking -> /login -> successful google login -> /booking frontend
// login -> successful google login -> /frontend
router.get("/google", async(req: Request, res: Response, next: NextFunction)=>{
    const redirect = req.query.redirect || "/"
passport.authenticate("google", {scope: ["profile","email"],state: redirect as string})(req,res,next)
})
// api/v1/auth/google/callback?state=/booking
router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/login"}) ,AuthController.googleCallbackController)

export const authRoutes = router