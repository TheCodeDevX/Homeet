import mongoose from "mongoose";


 const likesSchema = new mongoose.Schema({
    user : {
     type: mongoose.Schema.Types.ObjectId,
     ref: "User"
    },

     rating : {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Rating"
    },

     listing : {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Listing"
    },

    likes : {
        type: Number,
        trim:true,
        default:0,
    },
   
 }, {timestamps:true})

 const Likes = mongoose.model("Likes", likesSchema);
 export default Likes;