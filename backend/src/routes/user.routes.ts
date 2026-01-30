import express from "express"
const router = express.Router();
import { getUser } from "../controllers/user.controller.ts";

router.get("/user/:id", getUser);

export default router;