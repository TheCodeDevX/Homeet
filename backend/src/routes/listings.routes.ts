import express from 'express'
import { createListing, deleteListing, getListing, getListings, getUserListings, searchListings, updateListing, updateListingStatus }
 from '../controllers/listing.controller';
import { ListingValidationSchema } from '../utils/validationSchema';
import { handleValidation } from '../middlewares/validation.middlewares';
import { protect } from '../middlewares/auth.middlewares';


 const router = express.Router();

 router.post("/listings/post-listing",
  protect,
  ListingValidationSchema,
  handleValidation,
  createListing);

  router.get("/listings", protect, getListings)
  router.get("/search", protect, searchListings) //todo
  router.get("/listings/:id", protect, getListing)
  router.get("/dashboard", protect, getUserListings)
  router.post('/dashboard/status/:listingId', protect, updateListingStatus)
  router.route("/dashboard/:id")
  .delete(protect, deleteListing)
  .put(protect, updateListing)

 export default router;