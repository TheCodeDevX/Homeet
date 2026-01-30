import { create } from "zustand";
import { listingApi, ratingApi } from "../lib/axios.config";
import { isAxiosError } from "axios";
import type { ID, UserData } from "../../../backend/src/shared/types/types";
import { useAuthStore } from "./auhStore";

export type PricingType = "nightly" | "monthly" | "one_time" | "placeholder";
export interface FormData {
    title : string,
    description : string,
    location : string,
    images: string[];
    pricingType : PricingType
    amenities?: (string)[],
    price: number,
    beds?: number,
    bathrooms?:number,
    bedrooms?:number, 
    size?:number, 
    floor?:number, 
    pets:number,
    adults:number,
    children:number,
    avgRating?: number
    count?:number
    createdAt?: string
 }

 export type ApiData = {   
     _id?: string,
     updatedAt?: string ,
     user?:UserData
 } & FormData

 export type Rating = {
    value?: number,
    likes?:number,
    likers:string[],
    _id?: ID,
    user:UserData | null,
    listing : ApiData | null,
    feedback?: string,
    createdAt?: string,
    updatedAt?: string ,
 }
 

 interface ListingData {
    listing: ApiData | null,
    listings :ApiData[],
    userListings :ApiData[],
    isLoading: boolean,
    isCardLoading : boolean,
    isListingsLoading: boolean,
    error: string | null,
    message: string,
    currentPage : number,
    listingsLength : number,
    rating : Rating | null,
    isAlreadyLiked: boolean,
    isDashboardLoading : boolean,
    setIsAlreadyLiked : (bool:boolean) => void,
    userHasLikedRating:boolean,
    ratings : Rating[]
    setCurrentPage : (page:number) => void
    createListing : (data : FormData) => Promise<any>
    getListings : () => Promise<any>
    getListing : (listingId?:string) => Promise<any>
    getUserListings : () => Promise<any>
    deleteListing : (id:string) => void
    updateListing : (id:string, data:FormData) => void
    rateListing : (id:string, data: {stars?:number, feedback?:string}) => Promise<any>
    getRating : (id:string) => void
    getRatings : (id:string) => void
    likeRating : (id:string, likers: string[]) => void
   //  getLikes : (id:string) => void; 

 }

 
 
  export const useListingStore = create<ListingData>((set, get) => ({
    listing:null,
    listings: [],
    userListings:[],
    rating : null,
    ratings : [],
    isAlreadyLiked:false,
    isDashboardLoading:false,
    likes:null,
    likers : [],
    userHasLikedRating:false,
    isLoading:false,
    isListingsLoading : false,
    isCardLoading : false,
    error:null,
    message : "",
    currentPage:1,
    listingsLength:0,
    setCurrentPage : (currentPage) => set({currentPage}),
    setIsAlreadyLiked : (bool) => set({isAlreadyLiked:bool}),

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
         set({isDashboardLoading:true, error:null})
        try {
            const res = await listingApi.get("/dashboard")
            set({userListings:res.data.listings})
            return res.data.listings
        } catch (error) {
            let errMsg = "Error fetching listing"
            if(isAxiosError(error)){
             errMsg = error?.response?.data?.message || error?.response?.data?.errors[0]?.msg || errMsg;
        } else if (error instanceof Error){
            errMsg = error?.message || errMsg;
        }
        set({error:errMsg})
        }
        finally {
         set({isDashboardLoading:false})
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

     getRating : async(id) => {
      set({isLoading:true, error:null, message:""})
    try {
       const res = await ratingApi.get(`/rating/${id}`);
       set({rating : res.data?.rating, isLoading:false, message:res.data?.message})
     
    } catch (error) {
         let errMsg = "Error Fetching a Rating"
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
    },
    getRatings : async (listingID) => {
      set({isLoading:true, error:null})
      try {
         const response = await ratingApi.get(`/${listingID}`);
         set({ratings:response.data, isLoading:false})
      } catch (error) {
         let errMsg = "Error Fetching Ratings"
         if(isAxiosError(error)){
            errMsg = error?.response?.data?.message || error?.response?.data?.errors[0]?.msg || errMsg
         } else if (error instanceof Error) {
            errMsg = error.message || errMsg
         }
         set({error:errMsg, isLoading:false})
         throw error;
      }
    },

    likeRating : async (ratingId) => {
      set({isLoading:true, error:null});
      const authUserId = useAuthStore.getState().user?._id as string;
      set((state) => ({ratings:state.ratings.map((rating) => rating._id === ratingId 
         ? {...rating, likers: state.isAlreadyLiked ? rating.likers?.filter(id => id !== authUserId) 
            : [...rating.likers, authUserId]}
          : rating)}))
      try {
         const response = await ratingApi.post(`/likes/${ratingId}`);
         set((state) => ({isLoading:false, ratings: state.ratings.map((r) => 
            r._id?.toString() === ratingId.toString() 
            ? {...r, likers:response.data} 
            : r)
         }))
           
      } catch (error) {
         let errMessage = "Error liking a rating!"
         if(isAxiosError(error)) {
            errMessage = error.response?.data?.message || errMessage 
         } else if(error instanceof Error) {
            errMessage = error.message;
         }
         set({error:errMessage, isLoading:false})
         throw error
      }
    },

   //  getLikes : async (id) => {
   //    set({isLoading:true, error:null})
   //    try {
   //       const res = await ratingApi.get(`/likes/user/${id}`)
   //       set({isLoading:false, userHasLikedRating:res.data.userHasLikedRating})
   //    } catch (error) {
   //     let errMessage = "Error fetching data"
   //       if(isAxiosError(error)) {
   //          errMessage = error.response?.data?.message || errMessage 
   //       } else if(error instanceof Error) {
   //          errMessage = error.message;
   //       }
   //       set({error:errMessage, isLoading:false})
   //       throw error
   //    }
   //  }
  }))