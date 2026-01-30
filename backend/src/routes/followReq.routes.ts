
 import express from 'express'
import { getIncomingRequest, sendFollowRequest } from '../controllers/followReq.controller.ts';
import { protect } from '../middlewares/auth.middlewares.ts';

 const router = express.Router();

  router.post("/follow-request/:id", protect, sendFollowRequest);
  router.get("/follow-request", protect, getIncomingRequest)

  export default router;