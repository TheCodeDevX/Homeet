
import cloudinary from "../lib/cloudinary.ts";
import Message from "../models/messages.models.ts";
import User from "../models/user.models.ts";
import { getReceiverSocketId, io } from "../socket.ts";
import { createError } from "../utils/createError.ts";
import {Request, Response, NextFunction} from "express"



// @desc   Get Users for sidebar
// @route  GET /api/message/users
// @access Private
 export const getUsers = async(req:Request, res:Response, next:NextFunction) => {
  try{
    const authUser = req.authUser
    const users = await User.find({_id: {$ne : authUser._id}})
    res.status(200).json(users)
    console.log(`Users from getUsers controller $ne`, users)
  }
  catch(error) {
  console.error("error in getUsers controller", error);
  next(error)
  }

 }
    
// @desc   Get Online users
// @route  GET /api/message/messages/:id
// @access Private
 export const getMessages = async(req:Request, res:Response, next:NextFunction) => {
    try {
    const senderId = req.authUser._id
    const {id:receiverId} = req.params

    const messages = await Message.find({$or : [ { senderId, receiverId }, {senderId:receiverId, receiverId:senderId}]});
     res.status(201).json({messages});
     console.log("get messages ", messages)
      
    } catch (error) {
        console.error("error in getMessages controller", error);
        next(error);
    }

 }

// @desc   Send Messages
// @route  POST /api/message/send-messages/:id
// @access Private
 export const sendMessages = async(req:Request, res:Response, next:NextFunction) => {
    try {
    const {image, text} = req.body;
    const senderId = req.authUser._id
    const {id:receiverId} = req.params
    let imageUrl = "";
    
   if(image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;}


     const newMessage = new Message({
        senderId,
        receiverId,
        image:imageUrl || "",
        text,
     })

     await newMessage.save();
     
     const receiverSocketId = getReceiverSocketId(String(receiverId));

     if(receiverSocketId){
       io.to(receiverSocketId).emit("newMessage", newMessage)
     } else {
      console.log("this user is offline , will not emit")
     }

     res.status(201).json({message:newMessage});
     

    } catch (error) {
        console.error("error in sendMessages controller", error);
        next(error);
    }

 }