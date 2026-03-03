import { Router } from "express";
import { checkAuth, forgotPassword, googleCallback, handleAuthUser, handleUnauthorized, login, resetPassword, signup, updateProfile, verifyEmail, logout, profilePic, refreshToken, warmUp, facebookCallback }
 from "../controllers/auth.controller";
import { protect} from "../middlewares/auth.middlewares";
import passport from "passport";
import { loginValidationSchema, ProfileSchema, resetPasswordSchema, signupValidationSchema } from "../utils/validationSchema";
import { handleValidation } from "../middlewares/validation.middlewares";

const router = Router();
router.post("/signup", signupValidationSchema, handleValidation, signup)
router.post('/login', loginValidationSchema, handleValidation, login)
router.post('/logout', protect, logout)
router.put("/update-profile", protect, ProfileSchema, handleValidation, updateProfile)
router.post('/verify-email', protect, verifyEmail)
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPasswordSchema, handleValidation, resetPassword)
router.get("/checkAuth", protect, checkAuth)
router.get("/profilePic", protect, profilePic)
router.post("/refresh-token", protect, refreshToken);
router.get("/warm-up", warmUp)

router.get("/google", passport.authenticate("google", {scope : ["profile", "email"], session:false}))

router.get("/facebook", passport.authenticate("facebook", {
     scope : ["email","public_profile"],
     session:false,
}))

router.get("/google/callback", googleCallback)

router.get("/facebook/callback", facebookCallback)

router.use(protect)
router.get("/google/failed", handleUnauthorized)
router.get("/google/success", handleAuthUser)
router.get("/facebook/failed", handleUnauthorized)
router.get("/facebook/success",handleAuthUser)



export default router;
