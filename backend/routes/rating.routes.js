import express from 'express'
import { getRatings, rateListing } from "../controllers/rating.controller.js";
import { protect } from '../middlewares/auth.middlewares.js';


 const router = express.Router();
 router.post("/:id", protect, rateListing)
 router.get("/:id", protect, getRatings)

 export default router;