import mongoose, { isValidObjectId, PipelineStage, SortOrder } from "mongoose";
import cloudinary from "../lib/cloudinary";
import Listing from "../models/listing.models";
import { AppError, createError } from "../utils/createError";
import {Request, Response, NextFunction} from "express"





// @desc   Create new Listing
// @route  POST /api/listings/post-listing
// @access Private

 export const createListing = async(req:Request, res:Response, next:NextFunction) => {
  try {
    console.log("createListing", req.body.images)
  const {
    title,
    description,
    location,
    pricingType,
    images, 
    price, 
    amenities, 
    beds,
    bathrooms,
    bedrooms,
    size,
    floor,
    adults,
    children,
    pets
  } = req.body;
   const imageArray = Array.isArray(images) ? images : [images];

   const uploadImages = await Promise.all(imageArray.map(async(image) => {
    console.log(image)
    const uploadResponse = await cloudinary.uploader.upload(image);
    return  uploadResponse.secure_url;
   })).catch(err => console.error("Cloudinary error", err));

   const newListing = await Listing.create({
    user : req.authUser.id,
    title,
    description,
    location,
    pricingType,
    images : uploadImages,
    price,
    amenities,
    beds,
    bathrooms,
    bedrooms,
    size,
    floor,
    adults,
    children,
    pets
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

  export const getListings = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const limit = parseInt(req.query.limit?.toString() as string)
      const page = parseInt(req.query.page?.toString() as string)
      const skip = (page - 1) * limit
      console.log(`limit: ${limit} & page : ${page} & skip : ${skip} `)
      const listings = await Listing.find({status : "active"}).populate("user")
      .limit(limit).skip(skip)
      const listingsLength = await (await Listing.find({status : "active", user : {$ne : null}})).length
      console.log(listings, listingsLength)
      console.log(req.authUser)
      res.status(200).json({listings, listingsLength})
    } catch (error) {
      console.error("error in getUserListings controller", error)
      next(error)
    }
  }

  
 
// @desc   Get User's Listing
// @route  GET /api/listings/:id
// @access Private

  export const getListing = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const {id} = req.params;
      // if(!mongoose.Types.ObjectId.isValid(id)) {
      //  return res.status(400).json({error: "INVALID_ID_FORMAT"})
      // }
      const listing = await Listing.findById(id).populate("user")
      if(!listing) {
        createError("LISTING_NOT_FOUND", 404)
        return;
      }

      console.log("from getListing controller", listing)
      console.log("from getListing controller",req.authUser)
      res.status(200).json({listing})
    } catch (error) {
      console.error("error in getUserListing controller", error)
      next(error)
    }
  }


// @desc  Get User's Listings
// @route  GET /api/dashboard
// @access Private

  export const getUserListings = async(req:Request, res:Response, next:NextFunction) => {
    try {
      console.log(req.authUser)
      const listings = await Listing.find({user:req.authUser.id}).populate("user")
      console.log("from getListing controller", listings)
      console.log("from getListing controller",req.authUser)
      res.status(200).json({listings})
    } catch (error) {
      console.error("error in getUserListing controller", error)
      next(error)
    }
  }

// @desc   User's Listings
// @route  DELETE /api/dashboard/:id
// @access Private

  export const deleteListing = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const {id} = req.params;
      console.log(req.authUser)
      await Listing.findByIdAndDelete(id);
      res.status(200).json({ message : "LISTING_DELETED_SUCCESSFULLY"})
    } catch (error) {
      console.error("error in deleteListing controller", error)
      next(error)
    }
  }

// @desc   Update user's Listings
// @route  PUT /api/update-listing/:id
// @access Private

  export const updateListing = async(req:Request, res:Response, next:NextFunction) => {
    try {
    
    const {id} = req.params;
    const {
   title,
    description,
    location,
    pricingType,
    images, 
    price, 
    amenities, 
    beds,
    bathrooms,
    bedrooms,
    size,
    floor,
    adults,
    children,
    pets} = req.body;
    
    const listing = await Listing.findById(id);
    if(!listing) {
      createError("LISTING_NOT_FOUND", 404);
      return;
    }
     const uploadImages : string[] = images || []
     const uploadedImages  = await Promise.all(uploadImages.map(async(image) => {
    const uploadResponse = await cloudinary.uploader.upload(image);
    return uploadResponse.secure_url;
    }))
    listing.images = [...uploadedImages];
    console.log("uploaded images", uploadedImages)

    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.location = location || listing.location;
    listing.pricingType = pricingType || listing.pricingType;
    listing.price = price || listing.price;
    listing.amenities = amenities || listing.amenities;
    listing.beds = beds || listing.beds;
    listing.bathrooms = bathrooms || listing.bathrooms;
    listing.bedrooms = bedrooms || listing.bedrooms;
    listing.floor = floor || listing.floor;
    listing.size = size || listing.size;

    listing.adults = adults || listing.adults;
    listing.children = children || listing.children;
    listing.pets = pets || listing.pets;


    await listing.save()
    console.log(listing , "UPDATED LISTING")
       res.status(200).json({listing:listing, message : "SUCCESSFUL_UPDATED_LISTING",})
    } catch (error) {
      console.error("error in updateListing controller", error)
      next(error)
    }
  }

  // @desc   Update user's Listings
// @route  PUT /api/update-listing/:id
// @access Private

export const updateListingStatus = async(req:Request, res:Response, next:NextFunction) => {
  const {listingId} = req.params;
  const {status} = req.body;
  try {
     if(!listingId) {
         createError("LISTING_ID_NOT_FOUND", 404)
         return;
      }
      const listingStatus = await Listing.findByIdAndUpdate(listingId, 
        { status : status === "active" ? "inactive" : "active" }, {new : true})
   res.status(200).json({status : listingStatus?.status})
  } catch (error) {
     console.error("error in updateListingStatus", error)
      next(error)
  }
}

// @desc   Search
// @route  GET /api/search
// @access Private

export const searchListings = async(req:Request, res:Response, next:NextFunction) => {
  const {query, amenities, minPrice, maxPrice, pricingType, location,
     limit, page, price, date, rating, shouldSort} = req.query
  console.log(req.query, 'Query');
  const lim = Number(limit?.toString() ?? 0)
  const p = Number(page?.toString() ?? 0)
  try {
    const mustClauses:any[] = [];
    const filterClauses:any[] = [];
    const shouldClauses : any[] = [];

    if(query) {
      mustClauses.push({
        text : {
          query,
          path : [
          "title",        
          "description",
          "location",
          "pricingType",
          "amenities",
          "price.amount_usd",
          "price.amount_local",
          "price.currency"
          ],
          fuzzy : {maxEdits:1}
        }
      })
    }
   console.log(pricingType, 'type:', typeof pricingType)
    if(pricingType && pricingType !== "placeholder") {
      filterClauses.push({
      text: {
      query : pricingType.toString(),
      path: "pricingType"
      }
      })
      console.log(filterClauses, 'filterClauses & pricingType:', pricingType)
    }


      const range : {path:string; gte?:number; lte?:number} = {path : "price.amount_local"}
      if(+(minPrice ?? "0") && minPrice ) {
        range.gte = Number(minPrice.toString())
      }
      if(+(maxPrice ?? "0") && maxPrice) {
        range.lte = Number(maxPrice.toString())
      }
     
      if((minPrice && +(minPrice ?? "0")) || (maxPrice && +(maxPrice ?? "0"))){
         filterClauses.push({range})
      }
      
    

    if(amenities?.length) {
     const amenitiesArray = Array.isArray(amenities) ? amenities : [amenities]; // normalize to loop through it.
     amenitiesArray.forEach((amenity) => {
      filterClauses.push({text : {query : amenity, path : "amenities"}})
     })
    }


    if(location) {
      filterClauses.push({text : {query : location.toString(), path: "location" }})
    }


      
    const sortFields = () => {
    if(Boolean(shouldSort)) {
    // Price
    if(price) {
    switch(price) {
    case "cheap" :  return {["price.amount_usd"] : 1}
    case "expensive" : return {["price.amount_usd"] : -1}
    default : return null
    }
    }

    // Rating
   else if(rating) {
    switch(rating) {  
    case "low" :  return {avgRating : 1}
    case "high" : return  {avgRating : -1}
    default : return null
    }
   }
   
    // Date
   else if(date) {
    switch(date) {
    case "old" :  return {createdAt : 1}
    case "new" : return  {createdAt : -1}
    default : return null
    }
   }
   else return null
  }

  }
   const sort = sortFields()
   console.log("sort", sort)

 
    // if(mustClauses.length === 0 && filterClauses.length > 0) {
    //   mustClauses.push({exists : {path : "_id"}}) // match all documents so filterClauses work.
    // }

  console.log(`MUST : ${mustClauses} & FILTER : ${shouldClauses} & SHOULD ${shouldClauses}`)
    const searchStage = {
      $search : {
        index : "listings_search_index",
        compound : {
        must   : mustClauses,
        filter : filterClauses,
        // should : shouldClauses,
        }
      },
    }

    console.log('searchstage', searchStage)
    const pipeline = []

    if(query) {
      pipeline.push(searchStage)
      pipeline.push({
      $addFields : {
      score : {$meta : "searchScore"}
      }}
      )
      pipeline.push({$sort : {score : -1}})
    } else {
      pipeline.push({$sort : sort}) 
    }

    pipeline.push({$skip : (+p - 1) * +lim})
    pipeline.push({$limit : +lim})
    pipeline.push({
        $project : {
          title: 1,
          location: 1,
          description : 1,
          pricingType: 1,
          price: {
            amount_local : 1,
            amount_usd : 1,
            currency : 1
          },
          amenities : 1,
          score :1
        }
      })

    const listings = await Listing.aggregate(pipeline as any[])
 
    const listingIds = listings.map((l) => l._id)
     if(query){
      await Listing.bulkWrite(
      listings.map((listing) => ({
       updateOne: {
        filter : {_id: listing._id.toString()},
        update : {$set : {score : listing.score}}
       }
      }))
     )}
     
  
    const filteredListings = await Listing
    .find({_id: {$in : listingIds }})
    .populate("user")
    .sort(sort as Record<string, 1 | -1> | null)
    
    console.log(listings, "LISTINGS")
    console.log(filteredListings, "FILTERED LISTINGS")
    res.status(200).json( filteredListings)
  } catch (error) {
     console.error("error in searchListings", (error as AppError)?.message)
      next(error)
  }
}