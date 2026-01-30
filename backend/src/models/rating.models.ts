import mongoose from "mongoose";


 const ratingSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },

    listing : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Listing"
    },
    value : {
       type : Number,
       min : [0, "value must be at least 0"],
       max : [5, "value must be 5 or greater"],
       required : [true , "please enter a value"]
    },

    feedback : {
        type : String , 
        trim : true,
        default : ""
    },
    likers : [{type: String}]
 }, {timestamps:true})

  const Rating = mongoose.model("Rating", ratingSchema);
  export default Rating;