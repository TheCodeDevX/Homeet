
import mongoose from "mongoose";


 const NotifsSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },

    recipient : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    type : {
        type : String,
        enum : ["FOLLOW_REQUEST", "MESSAGE", "BOOKING"],
        default : "FOLLOW_REQUEST"
    },

    status : {
        type : String,
        enum : ["new", "read", "archived"],
        default : "new"
    },
    archivedAt : Date,
    readAt : Date,
    deletedAt:Date


 }, {timestamps:true})



  const Notification = mongoose.model("Notifs", NotifsSchema);
  export default Notification;