import express from 'express'
import { createListing, deleteListing, getListing, getListings, getUserListings, updateListing }
 from '../controllers/listing.controller.ts';
import { ListingValidationSchema } from '../utils/validationSchema.ts';
import { handleValidation } from '../middlewares/validation.middlewares.ts';
import { protect } from '../middlewares/auth.middlewares.ts';


 const router = express.Router();

 router.post("/listings/post-listing",
  protect,
  ListingValidationSchema,
  handleValidation,
  createListing);

  router.get("/listings", protect, getListings)
  router.get("/listings/:id", protect, getListing)
  router.get("/dashboard", protect, getUserListings)
  router.route("/dashboard/:id")
  .delete(protect, deleteListing)
  .put(protect, updateListing)

 export default router;