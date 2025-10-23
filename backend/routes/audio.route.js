 import express from "express"
import { uploadAudioFiles } from "../controllers/audio.controller.js";
 import multer from "multer"
  const router = express.Router();

 const storage = multer.memoryStorage();
 const multerStorage = multer({storage}).single("audio")

   router.post(`/upload-audio/:id`, multerStorage, uploadAudioFiles)
  //  router.get("/upload-audio", multerStorage, uploadAudioFiles)
   export default router;