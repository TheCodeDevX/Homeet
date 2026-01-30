import { Router } from "express";
import { protect } from "../middlewares/auth.middlewares";
import { bookProperty } from "../controllers/booking.controller"
 const router = Router();

router.post("/book-property/:listingId", protect, bookProperty)

export default router;
