
 import mongoose from 'mongoose'

 
  const MessageSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },

    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },

    text : {
        type : String ,
        default : ""
    },

    image : {
        type : String, 
        default : ""
    },

    audio : {
        type : String,
        default : "" 

    },
    audioDuration : {
        type : Number,
        default : 0
    }
  }, {timestamps: true } )

   const Message = mongoose.model("Message", MessageSchema);
   export default Message;