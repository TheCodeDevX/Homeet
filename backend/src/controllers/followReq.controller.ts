
import mongoose from "mongoose";
import FollowRequest from "../models/followRequest.models.ts";
import User from "../models/user.models.ts";
import { createError } from "../utils/createError.ts";
import {Request, Response, NextFunction} from "express"
import Notification from "../models/notifications.models.ts";

// @desc   Follow a Landlord
// @route  POST /api/requests/follow-request/:id
// @access Private

 export const sendFollowRequest = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const userId = req.authUser._id;
        const {id:recipientId} = req.params;
        
       
        if(recipientId === userId) {
          createError("ERR_SENDING_REQ_TO_YOURSELF", 403);
          return;
        }

         const recipient = await User.findById(recipientId);
         if(!recipient){
          createError("Recipient not found", 404)
          return;
         }

        // const existingFollowReq = recipient.followers.includes(userId.toString() as string);
        // console.log(existingFollowReq)


        // if(recipient.followers.includes(userId as string)) {
        //   createError("ALREADY_A_FOLLOWER", 400);
        //   return;
        // }

        const newFollowRequest = {
         sender : userId,
         recipient : recipientId
        }

         const existingFollowReq = await FollowRequest.findOne(newFollowRequest); 
       

        const followReq = new FollowRequest(newFollowRequest);
        
        await User.updateOne( {_id:recipientId }, 
        existingFollowReq ? { $pull : { followers : userId } }
         :  { $addToSet : { followers : userId } }
        )

         if(existingFollowReq) {
         const deleteReq = await FollowRequest.deleteOne({_id:existingFollowReq._id})
         console.log(userId, recipientId)
         console.log(deleteReq, existingFollowReq)
         res.status(200).json({message : "DELETED_FOLLOW_REQ", followReq, existingFollowReq:true}) 
        return;
        }
    
       if(!existingFollowReq) {
        await followReq.save();
        await followReq.populate(["recipient", "sender"])
        const notifs = await Notification.create({sender: new mongoose.Types.ObjectId(userId),
        recipient: new mongoose.Types.ObjectId(recipientId)
        })
        console.log("notifs", notifs )
        res.status(201).json({message : "SUCCESSFUL_FOLLOW_REQ", followReq , existingFollowReq:false})
       }

    } catch (error) {
      console.log("error in sendFollowRequest controller", error);
      next(error);
    }
 }

 
 // @desc  Get incoming requests
// @route  GET /api/requests/follow-request
// @access Private

 export const getIncomingRequest = async(req:Request, res:Response, next:NextFunction) => {
    try {
       const incomingReq = await FollowRequest.find({
        recipient: req.authUser.id
       }).populate(["sender", "recipient"])

      res.status(200).json(incomingReq);
      console.log(incomingReq, "from getIncRequest")
    } catch (error) {
      console.log("error in sendFollowRequest controller", error);
      next(error);
    }
 }

