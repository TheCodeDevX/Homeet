import { create } from "zustand";
import { listingApi, ratingApi } from "../lib/axios.config";
import { useAuthStore } from "./authStore";
import { errorHandler } from "./helpers/errorHelper";
import type { UserData } from "../types/types";

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
    _id?: string,
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
    likes : number,
    likers : string[],
    isAlreadyLiked: boolean,
    isDashboardLoading : boolean,
    isDeleting : boolean
    setIsAlreadyLiked : (bool:boolean) => void,
    userHasLikedRating:boolean,
    ratings : Rating[]
    setCurrentPage : (page:number) => void
    createListing : (data : FormData) => void
    getListings : () => void
    getListing : (listingId?:string) => void
    getUserListings : () => void
    deleteListing : (id:string) => void
    updateListing : (id:string, data:FormData) => void
    rateListing : (id:string, data: {stars?:number, feedback?:string}) => void
    getRating : (id:string) => void
    getRatings : (id:string) => void
    likeRating : (id:string, likers?:string[]) => void

 }

 
 
  export const useListingStore = create<ListingData>((set, get) => ({
    listing:null,
    listings: [],
    userListings:[],
    rating : null,
    ratings : [],
    isAlreadyLiked:false,
    isDashboardLoading:false,
    likes:0,
    likers : [],
    userHasLikedRating:false,
    isLoading:false,
    isListingsLoading : false,
    isCardLoading : false,
    isDeleting:false,
    error:null,
    message : "",
    currentPage:1,
    listingsLength:0,
    setCurrentPage : (currentPage) => set({currentPage}),
    setIsAlreadyLiked : (bool) => set({isAlreadyLiked:bool}),

    createListing : async(data) => {
     try {
      set({error:null, isListingsLoading:true})
      const res = await listingApi.post("/listings/post-listing", data);
      set({
      listing:res.data?.listing,
      message:res.data?.message
      })
     } catch (error) {
       const err = errorHandler({error, defaultErr: 'LISTING_CREATION_ERROR'})
        set({listing:null, error: err})
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
             const res = await listingApi.get(`/listings?limit=${12}&page=${currentPage}`);
             set({ isLoading:false, listings:res?.data?.listings, listingsLength:res?.data?.listingsLength})     
        } catch (error) {
         const err = errorHandler({error, defaultErr: 'FAILED_TO_FETCH_LISTINGS'})
        set({listings:[], error: err})
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
       } catch (error) {
        const err = errorHandler({error, defaultErr: 'FAILED_TO_FETCH_LISTING'})
        set({listings:[], error: err})
        throw error
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
    
        } catch (error) {
         const err = errorHandler({error, defaultErr: 'FAILED_TO_FETCH_USER_LISTINGS'})
        set({error:err})
        throw error
        }
        finally {
         set({isDashboardLoading:false})
        }
    },

     deleteListing : async(id) => {
      set({isDeleting:true, error:null})
      const listings = get().listings
      try {
         
         const res = await listingApi.delete(`/dashboard/${id}`)
         set({isLoading:false, listings: listings.filter((listing) => listing._id !== id), message:res.data.message})
      } catch (error) {
         const err = errorHandler({error, defaultErr: 'FAILED_TO_DELETE_LISTING'})
         set({error:err})
         throw error;
      }
      finally {
         set({isDeleting:false})
        }
    },

    updateListing : async(id, data) => {
      set({isLoading:true, error:null})
      try { 
         const res = await listingApi.put(`/dashboard/${id}`, data)
         set({isLoading:false, listing:res.data?.listing, message:res.data?.message})
      } catch (error) {
        const err = errorHandler({error, defaultErr : 'FAILED_TO_UPDATE_LISTING'})
         set({error:err})
         throw error;
      }
      finally {
         set({isLoading:false})
        }
    },
    
    rateListing : async(id, data) => {
      set({error:null});
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
      const err = errorHandler({error, defaultErr:'FAILED_TO_RATE_LISTING'})
      set({error:err})
      throw error;
    }
   
    },

     getRating : async(id) => {
      set({isLoading:true, error:null, message:""})
    try {
       const res = await ratingApi.get(`/rating/${id}`);
       set({rating : res.data?.rating, isLoading:false, message:res.data?.message})
     
    } catch (error) {
        const err = errorHandler({error, defaultErr: 'FAILED_TO_FETCH_RATING'})
         set({error:err})
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
        const err = errorHandler({error, defaultErr: 'FAILED_TO_FETCH_RATINGS'})
         set({error:err, isLoading:false})
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
        const err = errorHandler({error, defaultErr: 'FAILED_TO_LIKE_RATING'})
         set({error:err, isLoading:false})
         throw error
      }
    },
  }))