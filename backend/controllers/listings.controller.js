import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import Listing from "../models/listing.models.js";
import { createError } from "../utils/createError.js";




// @desc   Create new Listing
// @route  POST /api/listings/post-listing
// @access Private

 export const createListing = async(req, res, next) => {
  try {
    console.log("createListing", req.body.images)
  const {title,
    description,
    location,
    rentalType,
    images, 
    price, 
    amenities, 
    beds,
    bathrooms,
    bedrooms,
    size,
    floor} = req.body;
   const imageArray = Array.isArray(images) ? images : [images];

   const uploadImages = await Promise.all(imageArray.map(async(image) => {
    console.log(image)
    const uploadResponse = await cloudinary.uploader.upload(image);
    return  uploadResponse.secure_url;
   })).catch(err => console.error("Cloudinary error", err));

   const newListing = await Listing.create({
    user : req.user.id,
    title,
    description,
    location,
    rentalType,
    images : uploadImages,
    price,
    amenities,
    beds,
    bathrooms,
    bedrooms,
    size,
    floor,
   });

    console.log(newListing)



   res.status(201).json({listing : newListing, message : "SUCCESSFUL_CREATED_LISTING", success:true})
  } catch (error) {
    next(error)
  }

 }

 
// @desc   Get User's Listings
// @route  GET /api/listings
// @access Private

  export const getListings = async(req, res, next) => {
    try {
      const limit = parseInt(req.query.limit)
      const page = parseInt(req.query.page)
      const skip = (page - 1) * limit
      console.log(`limit: ${limit} & page : ${page} & skip : ${skip} `)
      const listings = await Listing.find().limit(limit).skip(skip).populate("user")
      const listingsLength = await (await Listing.find()).length
      console.log(listings, listingsLength)
      console.log(req.user)
      res.status(200).json({listings, listingsLength})
    } catch (error) {
      console.error("error in getUserListings controller", error)
      next(error)
    }
  }

  
 
// @desc   Get User's Listing
// @route  GET /api/listings/:id
// @access Private

  export const getListing = async(req, res, next) => {
    try {
      const {id} = req.params;
      if(!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({error: "INVALID_ID_FORMAT"})
      }
      const listing = await Listing.findById(id)
      if(!listing) {
        createError("LIS_UNFOUND", 404)
      }
      await listing.populate("user");
      console.log("from getListing controller", listing)
      console.log("from getListing controller",req.user)
      res.status(200).json({listing})
    } catch (error) {
      console.error("error in getUserListing controller", error)
      next(error)
    }
  }


// @desc  Get User's Listings
// @route  GET /api/dashboard
// @access Private

  export const getUserListings = async(req, res, next) => {
    try {
      console.log(req.user)
      const listings = await Listing.find({user:req.user.id})
      console.log("from getListing controller", listings)
      console.log("from getListing controller",req.user)
      res.status(200).json({listings})
    } catch (error) {
      console.error("error in getUserListing controller", error)
      next(error)
    }
  }

// @desc   User's Listings
// @route  DELETE /api/dashboard/:id
// @access Private

  export const deleteListing = async(req, res, next) => {
    try {
      const {id} = req.params;
      console.log(req.user)
      await Listing.findByIdAndDelete(id);
      res.status(200).json({ message : "DELETED_LIS"})
    } catch (error) {
      console.error("error in deleteListing controller", error)
      next(error)
    }
  }

// @desc   Update user's Listings
// @route  PUT /api/update-listing/:id
// @access Private

  export const updateListing = async(req, res, next) => {
    try {
    
    const {id} = req.params;
    const {
    title,
    description,
    location,
    rentalType,
    images,
    price,
    amenities,
    beds,
    bathrooms,
    bedrooms,
    size,
    floor} = req.body;
    
    const listing = await Listing.findById(id);
    if(!listing) {
      createError("LIS_UNFOUND", 404)
    }
     const uploadImages = images || []
     const uploadedImages  = await Promise.all(uploadImages.map(async(image) => {
    const uploadResponse = await cloudinary.uploader.upload(image);
    return uploadResponse.secure_url;
    }))
    listing.images = [...uploadedImages];
    console.log("uploaded images", uploadedImages)

    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.location = location || listing.location;
    listing.rentalType = rentalType || listing.rentalType;
    listing.price = price || listing.price;
    listing.amenities = amenities || listing.amenities;
    listing.beds = beds || listing.beds;
    listing.bathrooms = bathrooms || listing.bathrooms;
    listing.bedrooms = bedrooms || listing.bedrooms;
    listing.floor = floor || listing.floor;
    listing.size = size || listing.size;

    await listing.save()
    console.log(listing , "UPDATED LISTING")
       res.status(200).json({listing:listing, message : "SUCCESSFUL_UPDATED_LISTING",})
    } catch (error) {
      console.error("error in updateListing controller", error)
      next(error)
    }
  }