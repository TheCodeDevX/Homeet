import mongoose from "mongoose";
import validator from "validator"


 export const bookingSchema = new mongoose.Schema({
   
       firstName : {
       type : String,
       required : [true , 'First Name is required'],
       trim : true
       },
   
       lastName : {
       type : String,
       required : [true , 'Last Name is required'],
       trim : true
       },
   
       email : {
       type : String,
       required : [true , 'Email is required'],
       trim : true,
       lowercase : true,
       unique : true,
       sparse:true,
       validate : {
         validator :  function(v : string) {
         return validator.isEmail(v);
       },
        message : "Invalid email address"
       }
       },

      phoneNumber :{ type : String, default : ""},

      adultsCount : {
      type : Number,
      required : true
      },

      childrenCount : {
      type : Number,
      required : true
      },

      petsCount : {
      type : Number,
      required: true,
      },

      checkIn : {
      type : String,
      required : true
      },

      checkOut : {
      type : String,
      required: true,
      },

      userId : {
      type : String,
      required : true,
      },



 }, {timestamps:true})