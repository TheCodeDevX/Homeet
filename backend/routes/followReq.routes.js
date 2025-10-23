
 import express from 'express'
import { getIncomingRequest, sendFollowRequest } from '../controllers/users.controller.js';
import { protect } from '../middlewares/auth.middlewares.js';

 const router = express.Router();

  router.post("/follow-request/:id", protect, sendFollowRequest);
  router.get("/follow-request", protect, getIncomingRequest)

  export default router;