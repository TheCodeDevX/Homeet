import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from 'validator'
import crypto from "crypto"


 export const userSchema = new mongoose.Schema({
    googleId : {
    type : String,
    unique: true,
    sparse : true
    },

    facebookId : {
    type : String,
    unique: true,
    sparse : true
    },

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
      validator : validator.isEmail,
      message : "Invalid email address"
    },
    },

    password : {
    type : String,
    required: function() {
    return !this.googleId && !this.facebookId;
  },
    trim : true,
    minlength : [8, "the Password must be at least 8 characters long"],
    },

    profilePic : {
    type : String,
    default : ""
    },

    isVerified : {
    type : Boolean,
    default : false
    },
    
    onBoarded: {
    type : Boolean,
    default : false
    },

    
    bio : {
    type : String,
    default : ""
    },

    
    gender : {
    type : String,
    enum : ["male", "female", ""],
    default : ""
    },

    currency : {
    type : String,
    enum : ["usd", "euro", "british_pound", "japanese_yen",
       "canadian_dollar", "australian_dollar", "swiss_franc",
        "chinese_yuan", "saudi_riyal", "uae_dirham", "egyptian_pound",
         "moroccan_dirham", "brazilian_real", "indian_rupee", "turkish_lira",
          "south_african_rand", "singapore_dollar", "hong_kong_dollar"],

    default : "usd"
    },

    
    address : {
    type : String,
    default : ""
    },

    phoneNumber : {
    type : String,
    default : ""
    },

    role : {
      type : String,
      required : [true, "Role is required!"],
      enum : ["tenant", "homeowner", "seller"],
      default: "tenant"
    },

    followers : [
      { type : mongoose.Schema.Types.ObjectId }
    ],

    isSubscribed : {
      type : String,
      enum : ["unsubscibed", "subscribed", "pending"],
      default : "pending"
    },

    lastLogin : {
      type : Date,
      default: Date.now
    },

    resetPasswordToken : String,
    resetPasswordExpiresAt : Date,
    verificationToken : String,
    verificationTokenExpiresAt : Date,
    refreshToken : {
      type : String,
      select : false,
    },
    refreshTokenExpiresAt : {
      type : Date,
      select : false
    },

   

    }, {timestamps : true});

    userSchema.pre("save", async function(next) {
      if(!this.isModified("password")) return next();
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);

    });


    userSchema.pre("save", async function(next) {
      if(!this.refreshTokenExpiresAt) {
        this.refreshTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
      next()
    })

    userSchema.pre("save" , async function(next){
      if(!this.verificationToken) {
        this.verificationToken = Math.floor(100000 + Math.random() * 900000)
      }
      next()
    });

     userSchema.pre("save" , async function(next){
      if(!this.verificationTokenExpiresAt) {
        this.verificationTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 15 );
      }
      next()
    })

    userSchema.methods.matchPassword = async function(enteredPassword) {
     return await bcrypt.compare(enteredPassword, this.password);
    }

 const User = mongoose.model("User", userSchema);
 export default User;