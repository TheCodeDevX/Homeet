import express from 'express'
import {  getRating, getRatings, likeRating, rateListing } from "../controllers/rating.controller.ts";
import { protect } from '../middlewares/auth.middlewares.ts';


 const router = express.Router();
 router.post("/:id", protect, rateListing)
 router.get("/rating/:id", protect, getRating)
 router.get("/:listingId", protect, getRatings)
 router.post("/likes/:ratingId", protect, likeRating)
//  router.get("/likes/user/:id", protect, getLikes)

 export default router;