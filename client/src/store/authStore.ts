import {create} from 'zustand'
import { authApi } from '../lib/axios.config'
import {io} from "socket.io-client"
import { errorHandler } from './helpers/errorHelper'
import type { AuthData } from '../types/types'

 export const useAuthStore = create<AuthData>((set, get) => ({
    user : null,
    isAuthenticated: false,
    isNavigateToSignupPage : false,
    setIsNavigateToSignupPage : (value) => set({isNavigateToSignupPage:value}), 
    isLoading:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    error: null,
    accessToken : "",
    message : "",
    isOnboarding: false,
    setIsOnBoarding : (isOnboarding) => set({isOnboarding}),
    isSubmitted:false,
    email : "",
    onlineUsers:[],
    socket:null,
    profilePic:"",
    
    tryToRefreshAccessToken : async (code) => {
      try {
      const response = await authApi.post(`/refresh-token?code=${code}`);
      set({accessToken:response?.data?.accessToken, isLoading:false});
      const accessToken = get().accessToken
      return await authApi.post("/verify-email", { accessToken })
      } catch (error) {
      const err = errorHandler({error, defaultErr:"ERR_REFRESHING_TOKEN"});
      set({error : err, isLoading:false});
      if(err === "UNAUTH_USER") {
      set({isAuthenticated:false})
      }
      throw error;

      }
      },

    
    setEmail: (email) => set({email}),


    signup : async(data) => {
      set({isLoading:true, error:null })
       try {
        const res = await authApi.post("/signup", data)
        set({user : res?.data?.user, isAuthenticated:true, message:res?.data?.message})

       } catch (error) {
       const err = errorHandler({error, defaultErr:"USER_SIGNUP_FAILED"})
        set({error: err})
        throw error;
       } finally {
         set({isLoading:false})
       }

    },

    
   verifyEmail : async(code) => {
      set({error:null, isLoading:true, })
      try {
         let res = await authApi.post("/verify-email", {code})
         if(res?.data?.message === "EXPIRED_VERIFICATION_CODE") {
          res = (await get().tryToRefreshAccessToken(code));
         }
         if(res?.data?.success) {
         set({isAuthenticated:true, message:res?.data?.message, accessToken:""})
         }
      } catch (error) {
        const err = errorHandler({error, defaultErr : "USER_VERIFICATION_FAILED"})
        set({error:err})
        throw error;
      }
      finally {
         set({isLoading:false})
       }
   },

    login : async(data) => {
    set({isLoading:true, error:null, })
     try {
      const res = await authApi.post("/login", data)
      set({user:res?.data?.user})
      if(res?.data?.success) {
         set({isAuthenticated:true, message:res?.data?.message})
      }
     } catch (error) {
      const err = errorHandler({error, defaultErr : "USER_LOGING_FAILED"});
      set({error:err})
      throw error;
     } 
     finally {
         set({isLoading:false})
       }
    },

   forgotPassword : async(email) => {
      set({isLoading:true, error:null, })
    try {
      const res = await authApi.post("/forgot-password", {email})
      set({message:res?.data?.message, isSubmitted:true })
    } catch (error) {
      const err = errorHandler({error, defaultErr : "ERROR_FORGETTING_PASSWORD"})
      set({error:err})
      throw error;
    } finally {
         set({isLoading:false})
       }
    },


    checkAuth: async() => {
         set({error:null, isCheckingAuth:true})
        try {
         const res = await authApi.get("/checkAuth")
         set({user:res?.data?.user, isAuthenticated:true})
        } finally {
         set({isCheckingAuth:false, error:null})
       }
    },


    resetPassword : async(password, token) => {
     set({isLoading:true, error:null,})
     try {
      const res = await authApi.put(`/reset-password/${token}`, {password})
      set({message:res?.data?.message, isLoading:false, error:null})
     } catch (error) {
      const err = errorHandler({error, defaultErr : "ERROR_RESETING_PASSWORD"})
      set({error:err, isLoading:false})
      throw error;
     }
    },

    logout : async() => {
      set({isLoading:true, error:null});
      try {
      const res = await authApi.post("/logout");
      set({message:res?.data?.message,  isAuthenticated:false, error:null})
      get().disconnectSocket()
      } catch (error) {
         set({user:null, error:"USER_LOGOUT_FAILED", });
         throw error;
      } finally{
         set({isLoading:false})
      }
    },

    updateProfile : async(data) => {
      set({error:null, isUpdatingProfile:true})
      try {
         const res = await authApi.put("/update-profile", data);
         const {isOnboarding} = get()
         set({user:res?.data?.user, isUpdatingProfile:false,
             message: !isOnboarding ? res?.data?.message[0]
             : res?.data?.message[1]   })
      } catch (error) {
         const err = errorHandler({error, defaultErr : "PROFILE_UPDATING_FAILED"})
         set({error:err})
         throw error;
      } finally{
         set({isUpdatingProfile:false, isLoading:false})
      }
    },

    warmUp: async() => {
      await authApi.get("/warm-up");
    },


   connectSocket : () => {
      const authUser = get().user;
      if(!authUser || get()?.socket?.connected) return;
      const socket = io("https://homeet.onrender.com", {
         withCredentials:true,
         query : {
            userId : authUser._id
         }
      });

      socket.on("connect", () => console.log("socket is connected"));
      socket.on("getOnlineUsers", (userIds: string[]) => {
       set({onlineUsers : userIds})
      })
      socket.on("disconnect", () => {
         console.log("socket is disconnected");
        
      })

      set({socket:socket})
    },

    disconnectSocket : () => {
      if(get()?.socket?.connected){
         get().socket?.disconnect()
      }
    },
    
}))


    