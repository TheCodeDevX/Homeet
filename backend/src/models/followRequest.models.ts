import mongoose from "mongoose";


 const FollowRequestSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },

    recipient : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },


 }, {timestamps:true})

 FollowRequestSchema.index({ sender : 1, recipient: 1 }, {unique:true})

  const FollowRequest = mongoose.model("FollowRequest", FollowRequestSchema);
  export default FollowRequest;