import { Router } from "express";
import { protect } from "../middlewares/auth.middlewares";
import { bookProperty } from "../controllers/booking.controller"
import { bookingSchema } from "../utils/validationSchema";
import { handleValidation } from "../middlewares/validation.middlewares";
 const router = Router();

router.post("/book-property/:listingId", protect, bookProperty)

export default router;
