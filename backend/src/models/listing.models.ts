import mongoose from "mongoose";
import {bookingSchema} from '../models/booking.models'


 const listingPriceSchema = new mongoose.Schema({
   amount_usd : {type : Number, required : true},
   amount_local : {type : Number, required : true},
   currency : { type : String, enum : ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "SAR",
    "AED", "EGP", "MAD", "BRL", "INR", "TRY", "ZAR", "SGD", "HKD"], required : true}
 }, {_id:false})

 const listingShema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    title : {
        type : String,
        required : [true, "Title is required"],
        trim : true,
    },

    description : {
        type : String,
        required : [true, "Description is required"],
        trim : true,
    },

     location : {
        type : String,
        required : [true, "Location is required"],
        trim : true,
    },

    pricingType : {
        type : String,
        enum : ["nightly", "monthly", "one_time", "placeholder"],
        default : "placeholder",
        required : [true, "Rental Type is required"]
    },

    amenities : {
        type : [String],
        enum : ["Wi-Fi",
               "Furnished",
               "Parking",
               "Air Conditioning",
               "Kitchen Access",
               "Pet-Friendly",
               "Washer / Dryer",
               "Balcony",
               "Garden",
               "Gym",
               "Fireplace",
               "Pool"],
        default : []
    },

    images : {
        type : [String],
    },

    beds : {
        type : Number,
        default : 0
    },
    bathrooms : {
        type : Number,
        default : 0
    },
    bedrooms : {
        type : Number,
        default : 0
    },
    size : {
        type : Number,
        default : 0
    },
    floor : {
        type : Number,
        default : 0
    },

    pets : {
    type : Number,
    default : 0
    },

    children : {
    type : Number,
    default : 0
    },

    adults : {
    type : Number,
    default : 0
    },
    price : {
        type : listingPriceSchema,
        required : true
    },

      avgRating : {
        type : Number,
        default :0
    },

    count : {
        type : Number,
        default :0
    },

    status : {
        type : String,
        enum : ["active", "inactive"],
        default : "active"
    },

    score : {
        type : Number,
        default : 0
    },

    bookings : [bookingSchema]
     
 }, {timestamps : true});



 const Listing = mongoose.model("Listing", listingShema);
 export default Listing;