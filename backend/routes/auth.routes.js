import { Router } from "express";
import { checkAuth, forgotPassword, googleCallback, handleAuthorized, handleUnauthorized, login, resetPassword, signup, updateProfile, verifyEmail, logout, profilePic, refreshToken } from "../controllers/auth.controller.js";
import { protect} from "../middlewares/auth.middlewares.js";
import passport from "passport";
import { loginValidationSchema, ProfileSchema, signupValidationSchema } from "../utils/validationSchema.js";
import { handleValidation } from "../middlewares/validation.middlewares.js";

const router = Router();
router.post("/signup", signupValidationSchema, handleValidation, signup)
router.post('/login', loginValidationSchema, handleValidation, login)
router.post('/logout', logout)
router.put("/update-profile", protect, ProfileSchema, handleValidation, updateProfile)
router.post('/verify-email', verifyEmail)
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword)
router.get("/checkAuth", protect, checkAuth)
router.get("/profilePic", protect, profilePic)
router.post("/refresh-token", refreshToken)

router.get("/google", passport.authenticate("google", {scope : ["profile", "email"],
 session:false}))

router.get("/facebook", passport.authenticate("facebook", {scope : ["email","public_profile"]}))

router.get("/google/callback", googleCallback)

router.get("/facebook/callback", passport.authenticate("facebook",
     {session:false,  successRedirect: "/facebook/success", failureRedirect:"/facebook/failed"}))

router.use(protect)
router.get("/google/failed", handleUnauthorized)
router.get("/google/success", handleAuthorized)
router.get("/facebook/failed", handleUnauthorized)
router.get("/facebook/success",handleAuthorized)



export default router;
