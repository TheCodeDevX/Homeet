 import { getMessages, getUsers, sendMessages } from '../controllers/messages.controller.ts';
import {protect} from '../middlewares/auth.middlewares.ts'
 import express from "express";
 
 const router = express.Router();

  router.get("/users", protect, getUsers)
  router.get("/messages/:id", protect, getMessages)
  router.post("/send-messages/:id", protect, sendMessages)

   export default router;