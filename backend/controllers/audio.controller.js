 import {Readable} from 'stream'
import cloudinary from '../lib/cloudinary.js'
import Listing from '../models/messages.models.js'
import { io } from '../socket.js'


 // @desc  Upload audio file
// @route  PUT /api/auth/uploading/upload-audio
// @access Private
 export const uploadAudioFiles = async(req, res, next) => {
  try {
    const {id:receiverId} = req.params
    const {senderId} = req.body

    console.log(receiverId, "receiverId")
    console.log(senderId, "senderId")
    console.log(req.file, "file")
    if(!req.file) {
        createError("NO_AUDIO_FILE", 400)
    };
    const bufferStream = new Readable();

    bufferStream.push(req.file.buffer)
    bufferStream.push(null)

    const uploadRes = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({
        resource_type: "auto",
        folder: "audio-files"
     },(err, result) => {
        if(err) reject("FAILED_UPLOADING_AUDIO")
     resolve(result)
    })
      bufferStream.pipe(stream)
    })

    console.log(uploadRes)

    const message = new Listing({ audio : uploadRes.secure_url, text:"", image:"", receiverId, senderId ,
       audioDuration : uploadRes.duration
    })
    await message.save()
    io.to(receiverId).emit("newMessage", message)
    console.log("Audio", message)
    res.status(201).json({message})

  } catch (error) {
    console.error("error in uploadAudioFiles controller", error)
    next(error)
  }
 }