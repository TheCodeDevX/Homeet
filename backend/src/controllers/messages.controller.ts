
import { isValidObjectId } from "mongoose";
import cloudinary from "../lib/cloudinary";
import Message from "../models/messages.models";
import User from "../models/user.models";
import { MessageData, MessageResponse, NewMessageResponse } from "../shared/types/types";
import { getReceiverSocketId, io } from "../socket";
import { createError } from "../utils/createError";
import {Request, Response, NextFunction} from "express"



// @desc   Get Users for the sidebar
// @route  GET /api/message/users
// @access Private
 export const getUsers = async(req:Request, res:Response, next:NextFunction) => {
  try{
    const authUser = req.authUser
    const users = await User.find({_id: {$ne : authUser._id}, onBoarded:true})
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
    const {id:receiverId} = req.params;

    if(!isValidObjectId(receiverId)) {
      createError("INVALID_RECEIVER_ID", 404);
      return;
    }

    const messages = await Message.find({$or : [ { senderId, receiverId }, {senderId:receiverId, receiverId:senderId}]});
    const MessageResponse : MessageResponse = { messages, success : true }
     res.status(201).json(MessageResponse);
     console.log("get messages", messages)
      
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

     if(!isValidObjectId(receiverId)) {
      createError("INVALID_RECEIVER_ID", 404);
      return;
    }
    
    let imageUrl = "";
    
   if(image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url
  }


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
     const MessageResponse : NewMessageResponse = {message : newMessage, success : true}
     res.status(201).json(MessageResponse);
    } catch (error) {
      console.error("error in sendMessages controller", error);
      next(error);
    }

 }