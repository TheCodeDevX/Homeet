 import { getMessages, getUsers, sendMessages } from '../controllers/messages.controller.js';
import {protect} from '../middlewares/auth.middlewares.js'
 import express from "express";
 
 const router = express.Router();

  router.get("/users", protect, getUsers)
  router.get("/messages/:id", protect, getMessages)
  router.post("/send-messages/:id", protect, sendMessages)

   export default router;