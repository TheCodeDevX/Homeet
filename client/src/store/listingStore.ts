import { create } from "zustand";
import { listingApi, ratingApi } from "../lib/axios.config";
import { useAuthStore } from "./authStore";
import { errorHandler } from "./helpers/errorHelper";
import type { CurrencyCode, StatusEnum, UserData } from "../types/types";
import type { SortStates } from "../context/FilterProvider";

export type PricingType = "nightly" | "monthly" | "one_time" | "placeholder";
export type SearchData = Pick<ApiData, "amenities" | "location">
& { minPrice?: number, maxPrice?: number,
    query?:string, pricingType?:PricingType, shouldFilter?:boolean, shouldSort?:boolean, limit?:number, page?:number 
   sort?: SortStates
   }

export interface FormData {
    title : string,
    description : string,
    location : string,
    images: string[];
    pricingType : PricingType
    amenities?: (string)[],
    price: {
      amount_usd : number,
      amount_local : number | string,
      currency: CurrencyCode | undefined
    },
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
 export type Booking = {
   costPrice?: {amount_usd: number, amount_local: number, currency:CurrencyCode},
   offerPrice?: {amount_usd: number, amount_local: number, currency:CurrencyCode},
   userId?: string,
   checkIn?: string,
   checkOut?: string,
   petsCount?: number,
   childrenCount?: number,
   adultsCount?: number,
   profilePicture?: string | undefined,
   createdAt?: string,
   updatedAt?: string,
   _id?:string
 } & Pick<UserData, "firstName" | "lastName" | "email" | "phoneNumber" | "role">

 export type ApiData = {   
     _id?: string,
     updatedAt?: string ,
     user?:UserData,
     bookings?: Booking[],
     status: StatusEnum
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
    ratings : Rating[],
    status : StatusEnum
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
    likeRating : (id:string, likers?:string[]) => void,
    updateStatus : (id:string, status:StatusEnum) => void
    searchListings : (data: SearchData | null) => void
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
    status:"active",
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
         const params = new URLSearchParams()
         params.append("limit", "12")
         params.append("page", currentPage.toString())
         const res = await listingApi.get(`/listings?${params.toString()}`);
         set({ listings:res?.data?.listings, listingsLength:res?.data?.listingsLength})     
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

    updateStatus : async(listingId, status) => {
      try {
         const response = await listingApi.post(`/dashboard/status/${listingId}`, {status})
         set((state) => ({userListings : state.userListings.map((listing) => listing._id === listingId 
            ? {...listing, status: status === "active" ? "inactive" : "active"} 
            : listing)}))
         set({status:response.data?.status})
      } catch (error) {
          const err = errorHandler({error, defaultErr: 'FAILED_TO_UPDATE_LISTING_STATUS'})
         set({error:err, isLoading:false})
         throw error
      }
    },

     searchListings : async(data) => {
      set({error:null})
      try {
         const params = new URLSearchParams();
         if(data?.query) {
         params.append("query", data.query)
         if(data?.shouldFilter) {
         params.append("minPrice", (data?.minPrice ?? 0).toString())
         params.append("maxPrice", (data?.maxPrice ?? 0).toString() )
         data.amenities?.forEach((amenity) => {
         params.append("amenities", amenity)
         })
         params.append("pricingType", data.pricingType ?? "")
         params.append("location", data.location)
         }  
         }
         else if(data?.shouldSort) {
         params.append("shouldSort", String(data?.shouldSort))
         if(data?.sort?.date && data?.sort?.date !== "none") {
            params.append("date", data.sort?.date)
         }
         if(data.sort?.price && data?.sort?.price !== "none") {
         params.append("price", data.sort.price)
         }
           
         if(data.sort?.rating && data?.sort?.rating !== "none") {
         params.append("rating", data.sort.rating)
         }
         }
         params.append("limit", "20" )
         params.append("page", "1" )
    
         const res = await listingApi.get(`/search?${params.toString()}`)
         if(res?.data?.length < 1 || !(res?.data)) return;
         set((state) => ({...state, listings : res?.data}))
      } catch (error) {
         const err = errorHandler({error, defaultErr: 'FAILED_TO_SEARCH_LISTINGS'})
         set({error:err})
         throw error
      } 
    }
  }))