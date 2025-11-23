
import mongoose from "mongoose";
import FollowRequest from "../models/followRequest.models.js";
import User from "../models/user.models.js";
import { createError } from "../utils/createError.js";

// @desc   Follow a Landlord
// @route  POST /api/requests/follow-request/:id
// @access Private

 export const sendFollowRequest = async (req, res , next) => {
    try {
        const userId = req.user.id;
        const {id:recipientId} = req.params;
        
       
        if(recipientId === userId) {
          createError("ERR_SENDING_REQ_TO_YOURSELF");
          return;
        }

         const recipient = await User.findById(recipientId);

            const existingFollowReq = recipient.followers.includes(userId);
          console.log(existingFollowReq)
       

        // if(recipient.followers.includes(userId)) {
        //   createError("ALREADY_A_FOLLOWER");
        //   return;
        // }

       

        const followReq = new FollowRequest({
         sender : userId,
         recipient : recipientId
        })

        await User.updateOne( {_id:followReq.recipient }, 
        existingFollowReq ? { $pull : { followers : userId } }
         :  { $addToSet : { followers : userId } }
        )

         if(existingFollowReq) {
         const deleteReq = await FollowRequest.deleteOne({ recipient: new mongoose.Types.ObjectId(recipientId),
           sender: new mongoose.Types.ObjectId(userId) })
         console.log(userId, recipientId)
         console.log(deleteReq, existingFollowReq)
         res.status(200).json({message : "DELETED_FOLLOW_REQ", followReq, existingFollowReq}) 
        return;
        }
    
       if(!existingFollowReq) {
        await followReq.save();
        await followReq.populate("recipient")
        res.status(201).json({message : "SUCCESSFUL_FOLLOW_REQ", followReq , existingFollowReq})
       }

    } catch (error) {
      console.log("error in sendFollowRequest controller", error);
      next(error);
    }
 }

 
 // @desc  Get incoming requests
// @route  GET /api/requests/follow-request
// @access Private

 export const getIncomingRequest = async (req, res , next) => {
    try {
       const incomingReq = await FollowRequest.find({
        recipient: req.user.id
       }).populate("sender")

      res.status(200).json(incomingReq);
      console.log(incomingReq, "from getIncRequest")
    } catch (error) {
      console.log("error in sendFollowRequest controller", error);
      next(error);
    }
 }

