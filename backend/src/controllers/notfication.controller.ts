
import { NextFunction, Request, Response } from "express";
import Notification from "../models/notifications.models";
import mongoose from "mongoose";
import { Agenda, type Job } from "agenda"
import { createError } from "../utils/createError";
import dotenv from 'dotenv'
dotenv.config();

 
 // @desc  Get incoming notifications
// @route  GET /api/notifications
// @access Private


 export const getIncomingNotifications = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const limit = parseInt(req.query.limit?.toString() as string)
      const page = parseInt(req.query.page?.toString() as string)
      const skip = (page - 1) * limit;

       const incomingNotifs = await Notification.find({
        recipient: req.authUser.id,
        status : {$nin : ["archived"]},
       }).limit(limit).skip(skip).populate(["sender", "recipient"])
       
        res.status(200).json({incomingNotifs, page});
        console.log(incomingNotifs, "from notifs")
    } catch (error) {
      console.log("error in getIncomingNotifications controller", error);
      next(error);
    }
 }

 // @desc  Mark notifications as read
// @route  POST /api/notifications/read-notifs
// @access Private


 export const markNotifsAsRead = async(req:Request, res:Response, next:NextFunction) => {
   const {notifIds} : {notifIds : string[]} = req.body;
 try {
  
  await Notification.updateMany({_id : {$in : notifIds}}, { $set : { status : "read", readAt : new Date() } });
  const notifications = await Notification.find({status : {$nin : ['archived']},
     recipient: new mongoose.Types.ObjectId(req.authUser._id)})
    
  //  const readNotifs = await Notification.find({status : "read",
  //  recipient: new mongoose.Types.ObjectId(req.authUser._id)})
  console.log(notifications, "notifications from markNotifsAsRead")
  res.status(200).json({notifIds})
 } catch (error) {
    console.log("error in markNotifsAsRead controller", error);
    next(error);
 }
 }

 export const archiveNotifs = async(req:Request, res:Response, next:NextFunction) => {

  try {
    const {notifIds} : {notifIds : string[]} = req.body;
   if(!notifIds) return;
   await Notification.updateMany({_id : {$in : notifIds}, status : "read"},
   { $set : {status : "archived"} });
  } catch (error) {
    console.log("error in archiveNotifs controller", error);
    next(error);
  }
 }

 
 export const deleteArchivedNotifications = async() => {

 try {
  const mongoURI : string | undefined = process.env.MONGO_URI;
  if(!mongoURI) {
  createError("mongoURI isn't found", 400);
  return;
  }
  console.log('delete notifs')
   const agenda = new Agenda({db : {address : mongoURI}});
    agenda.define("cleanup-archived-notifications", async (job: Job) => {
    await Notification.deleteMany({_id : {$in : job.attrs.data.archivedNotificationIds}});
    });

   await agenda.start()
  const jobs = await agenda.jobs({name : "cleanup-archived-notifications"})
  await Promise.all(jobs.map(job => job.remove()))

  
  
   const notifs = await Notification.find(
    {
     status : 'archived',
     readAt : { $lt : new Date( Date.now() - 1000 * 60 * 60 * 24 * 30) } 
    }
  );

   const job = agenda.create('cleanup-archived-notifications', {archivedNotificationIds: notifs.map(n => n._id)});
   job.repeatEvery("0 0 * * *", {timezone : "Africa/Casablanca"})
   await job.save();

   // SHUTDOWN GRACEFULLY
   process.on("SIGINT", async () => {
   await agenda.stop()
   process.exit(0);
   })

 } catch (error) {
    console.log("error in deleteArchivedNotifs", error);
 }

 }