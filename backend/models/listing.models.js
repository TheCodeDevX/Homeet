import mongoose from "mongoose";



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

    rentalType : {
        type : String,
        enum : ["nightly", "monthly", "for sale", "placeholder"],
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
    price : {
        required : [true , "Price is required"],
        type : Number,
    },

      avgRating : {
        type : Number,
        default :0
    },

    count : {
        type : Number,
        default :0
    }

   
     
 }, {timestamps : true});



 const Listing = mongoose.model("Listing", listingShema);
 export default Listing;