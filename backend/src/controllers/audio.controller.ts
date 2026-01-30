 import {Readable} from 'stream'
import cloudinary from '../lib/cloudinary.ts'
import Listing from '../models/messages.models.ts'
import { getReceiverSocketId, io } from '../socket.ts'
import { createError } from '../utils/createError.ts'
import {Request, Response, NextFunction} from 'express'
import { UploadApiResponse } from 'cloudinary'
import { ReadableByteStreamController } from 'stream/web'


 // @desc  Upload audio file
// @route  PUT /api/auth/uploading/upload-audio
// @access Private
 export const uploadAudioFiles = async(req:Request, res:Response, next:NextFunction) => {
  try {
    const {id:receiverId} = req.params
    const {senderId} = req.body

    console.log(receiverId, "receiverId")
    console.log(senderId, "senderId")
    console.log(req.file, "file")
    if(!req.file) {
        createError("NO_AUDIO_FILE", 400)
        return;
    };
    const bufferStream = new Readable();

    bufferStream.push(req.file.buffer)
    bufferStream.push(null)

    const uploadRes : UploadApiResponse | undefined = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({
        resource_type: "video",
        folder: "audio-files"
     },(err, result) => {
     if(err) reject(new Error("FAILED_UPLOADING_AUDIO"));
     resolve(result);
    })
      bufferStream.pipe(stream) // upload data from the redable form (the actual file) to the writable form
      // which is the cloud in our case
    })

    console.log(uploadRes)
    const receiverSocketId = getReceiverSocketId(String(receiverId));

    const message = new Listing({ audio :  uploadRes?.secure_url, text:"", image:"", receiverId, senderId ,
       audioDuration : uploadRes?.duration
    })
    await message.save();
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", message)
    }
    console.log("Audio", message)
    res.status(201).json({message})

  } catch (error) {
    console.error("error in uploadAudioFiles controller", error)
    next(error)
  }
 }