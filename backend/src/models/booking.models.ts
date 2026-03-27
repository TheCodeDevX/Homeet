import mongoose from "mongoose";
import validator from "validator"



const priceSchema = new mongoose.Schema({
  amount_usd : { type : Number, required : true },
  amount_local : { type : Number, required : true },
  currency : {
    type : String,
    required : true,
    enum : ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SAR",
    "AED", "EGP", "MAD", "BRL", "INR", "TRY", "ZAR", "SGD", "HKD"]
  }
}, {_id : false})

 export const bookingSchema = new mongoose.Schema({
       
       firstName : {
       type : String,
       required : true, 
       trim : true
       },
   
       lastName : {
       type : String,
       required : true,
       trim : true
       },
   
       email : {
       type : String,
       required : true,
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
      required : function() {
        return !this.offerPrice
      }
      },

      checkOut : {
      type : String,
      required: function() {
        return !this.offerPrice
      },
      },
      offerPrice : {
        type : priceSchema,
        required : function() {
        return !(this.checkIn && this.checkOut)
      }
      },

      message : {
      type : String,
      required : false,
      },

      userId : {
      type : String,
      required : true,
      },

      profilePicture : {
        type: String,
        required : true,
      },
       role : {
        type: String,
        required : true,
      },
      costPrice : {type : priceSchema, required : true}


 }, {timestamps:true})