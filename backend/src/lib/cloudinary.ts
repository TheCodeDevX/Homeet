
import { v2 as cloudinary } from "cloudinary";
import 'dotenv/config'

 type CloudinaryEnvUnion = "CLOUDINARY_CLOUD_NAME" | "CLOUDINARY_API_KEY" | "CLOUDINARY_API_SECRET"

 const Env = (key:CloudinaryEnvUnion) : string => {
   if(!process.env[key]) throw new Error(`Missing environment variable ${key}`)
   return process.env[key];
 };

 cloudinary.config({
    cloud_name : Env("CLOUDINARY_CLOUD_NAME"),
    api_key : Env("CLOUDINARY_API_KEY"),
    api_secret : Env("CLOUDINARY_API_SECRET")

 })

 export default cloudinary;