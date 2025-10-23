import { create } from "zustand";
import { listingApi, ratingApi } from "../lib/axios.config";
import { isAxiosError } from "axios";
import type { UserData } from "./auhStore";

export type RentalType = "nightly" | "monthly" | "for sale" | "placeholder";
export interface FormData {
    title : string,
    description : string,
    location : string,
    images: string[] ;
    
    rentalType : RentalType
    amenities?: (string)[],
    price: number,
    beds?: number,
    bathrooms?:number,
    bedrooms?:number, 
    size?:number, 
    floor?:number, 
    avgRating?: number
    count?:number
 }

 export type ApiData = {   
     _id?: string,
     createdAt?: string,
     updatedAt?: string ,
     user?:UserData
 } & FormData

 type Rating = {
   value?: number,
    feedback?: string,
    createdAt?: string,
    updatedAt?: string ,
 }
 

 interface ListingData {
    listing: ApiData | null,
    listings :ApiData[],
    isLoading: boolean,
    isCardLoading : boolean,
    isListingsLoading: boolean,
    error: string | null,
    message: string,
    currentPage : number,
    listingsLength : number,
    rating : Rating | null,
    setCurrentPage : (page:number) => void
    createListing : (data : FormData) => Promise<any>
    getListings : () => Promise<any>
    getListing : (listingId?:string) => Promise<any>
    getUserListings : () => Promise<any>
    deleteListing : (id:string) => void
    updateListing : (id:string, data:FormData) => void
    rateListing : (id:string, data: {stars?:number, feedback?:string}) => Promise<any>
    getRatings : (id:string) => void
 }

 
 
  export const useListingStore = create<ListingData>((set, get) => ({
    listing:null,
    listings: [],
    rating : null,
    isLoading:false,
    isListingsLoading : false,
    isCardLoading : false,
    error:null,
    message : "",
    currentPage:1,
    listingsLength:0,
    setCurrentPage : (currentPage) => set({currentPage}),

    createListing : async(data) => {
     try {
      set({ error:null, isListingsLoading:true})
         const res = await listingApi.post("/listings/post-listing", data);
         set({ listing:res.data?.listing, isListingsLoading:false,
             message:res.data?.message })
     } catch (error) {
        let errMsg = "Error creating listing"
        if(isAxiosError(error)) {
            errMsg = error?.response?.data?.errors[0]?.msg ||  error?.response?.data?.message || errMsg;
        } else if (error instanceof Error){
            errMsg = error?.message || errMsg;
        }
       
        set({listing:null, error: errMsg, message:""})
        throw error;
     }

     finally {
     set({isListingsLoading : false})
     }
    },
    getListings : async () => {
    set({isLoading:true, error:null})

    const currentPage = get().currentPage;
        try {
             const res = await listingApi.get(`/listings?limit=${3}&page=${currentPage}`);
             set({ isLoading:false, listings:res?.data?.listings, listingsLength:res?.data?.listingsLength})     
             return res.data.listings
             
        } catch (error) {
             let errMsg = "Error fetching listings"
        if(isAxiosError(error)) {
            errMsg = error?.response?.data?.message || error?.response?.data?.errors[0]?.msg || errMsg;
        } else if (error instanceof Error){
            errMsg = error?.message || errMsg;
        }
       
        set({listings:[], error: errMsg})
        throw error;
        } finally {
         set({isLoading:false})
        }
    },

    getListing : async (listingId) => {
        set({isCardLoading:true, error:null})
        try {
            const res = await listingApi.get(`/listings/${listingId}`)
            set({listing:res.data.listing, isLoading:false})
            return res.data.listing
        } catch (error) {
            let errMsg = "Error fetching listing"
            if(isAxiosError(error)){
             errMsg = error?.response?.data?.message || error?.response?.data?.errors[0]?.msg || errMsg;
        } else if (error instanceof Error){
            errMsg = error?.message || errMsg;
        }
        set({error:errMsg, listing:null})
        }
        finally {
         set({isCardLoading:false})
        }
    },

    getUserListings : async () => {
         set({isLoading:true, error:null})
        try {
            const res = await listingApi.get("/dashboard")
            set({listings:res.data.listings, isLoading:false})
            return res.data.listings
        } catch (error) {
            let errMsg = "Error fetching listing"
            if(isAxiosError(error)){
             errMsg = error?.response?.data?.message || error?.response?.data?.errors[0]?.msg || errMsg;
        } else if (error instanceof Error){
            errMsg = error?.message || errMsg;
        }
        set({error:errMsg, listings:[]})
        }
        finally {
         set({isLoading:false})
        }
    },

     deleteListing : async(id) => {
      set({isLoading:true, error:null, message:""})
      const listings = get().listings
      try {
         
         const res = await listingApi.delete(`/dashboard/${id}`)
         set({isLoading:false, listings: listings.filter((listing) => listing._id !== id), message:res.data.message})
      } catch (error) {
         let errMsg = "Error Deleting Listing"
         if(isAxiosError(error)){
            errMsg = error?.response?.data?.message || error?.response?.data?.errors[0]?.msg || errMsg
         } else if(error instanceof Error){
            errMsg = error?.message || errMsg
         }
         set({error:errMsg,  message:""})
         throw error;
      }
      finally {
         set({isLoading:false})
        }
    },

    updateListing : async(id, data) => {
      set({isLoading:true, error:null, message:""})
      try { 
         const res = await listingApi.put(`/dashboard/${id}`, data)
         set({isLoading:false, listing:res.data?.listing, message:res.data?.message})
         return res.data.listing;
      } catch (error) {
         let errMsg = "Error Updating Listing"
         if(isAxiosError(error)){
            errMsg = error?.response?.data?.message || error?.response?.data?.errors[0]?.msg || errMsg
         } else if(error instanceof Error){
            errMsg = error?.message || errMsg
         }
         set({error:errMsg, listing:null, message:""})
         throw error;
      }
      finally {
         set({isLoading:false})
        }
    },
    
    rateListing : async(id, data) => {
      set({ error:null, message:""});
      
    try {
       const res = await ratingApi.post(`/${id}`, data);
       set({rating : res.data?.rating, message:res.data?.message})
       set((state) => ({
         listings : state.listings.map((listing) => (
            listing._id === id ? {...listing, avgRating: res.data.listing.avgRating, count:res.data.listing.count }
             : listing
         ))
      }))
    } catch (error) {
         let errMsg = "Error Rating a Listing"
         if(isAxiosError(error)){
            errMsg = error?.response?.data?.message || error?.response?.data?.errors[0]?.msg || errMsg
         } else if(error instanceof Error){
            errMsg = error?.message || errMsg
         }
         set({error:errMsg, message:"", rating:null})
         throw error;
    }
   
    },

     getRatings : async(id) => {
      set({isLoading:true, error:null, message:""})
    try {
       const res = await ratingApi.get(`/${id}`);
       set({rating : res.data?.rating, isLoading:false, message:res.data?.message})
     
    } catch (error) {
         let errMsg = "Error Fetching Ratings"
         if(isAxiosError(error)){
            errMsg = error?.response?.data?.message || error?.response?.data?.errors[0]?.msg || errMsg
         } else if(error instanceof Error){
            errMsg = error?.message || errMsg
         }
         set({error:errMsg, message:"", rating:null})
         throw error;
    }
    finally {
         set({isLoading:false})
   }
    }
  }))