import {create} from 'zustand'
import axios, { isAxiosError } from 'axios'
import { authApi } from '../lib/axios.config'
import {type Socket, io} from "socket.io-client"
import { handleAxiosError } from './helpers/errorHelper'
import type {UserRole, UserData, ProfileData, VerifyEmailResponse, LogoutResponse} from '../../../backend/src/shared/types/types'


// const naviagte = useN



 interface AuthData {

    user : UserData | null
    isAuthenticated : boolean
    isLoading : boolean
    isNavigateToSignupPage :boolean
    setIsNavigateToSignupPage : (value:boolean) => void
    isCheckingAuth : boolean
    error : string | null
    message : string
    isOnboarding: boolean,
    isUpdatingProfile:boolean,
    setIsOnBoarding : (value : boolean ) => void
    isSubmitted : boolean
    email : string,
    profilePic: string,
    accessToken:string,
    socket : Socket | null
    onlineUsers : string[]
    setEmail : (email:string) => void;
    signup : (data : Pick<UserData, "firstName" | "lastName" | "email" | "password">) => Promise<void>
    login : (data : Pick<UserData, "email" | "password">) => Promise<void>
    forgotPassword : (email:string) => Promise<void>;
    logout : () => Promise<void>
    verifyEmail : (code : string) => Promise<void>
    resetPassword : (password:string, token?:string) => void;
    checkAuth : () => Promise<void>
    updateProfile : (data : ProfileData) => Promise<void>
    warmUp : () => void, 
    connectSocket : () => void,
    disconnectSocket : () => void;
    tryToRefreshAccessToken : (code:string) => Promise<any>;
    

 }





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
      set({accessToken:response.data, isLoading:false});
      const accessToken = get().accessToken
      return await authApi.post("/verify-email", { accessToken })
      } catch (error) {
      const errMessage = handleAxiosError(error);

      set({error : errMessage, isLoading:false});
      if(errMessage === "UNAUTH_USER") {
      set({isAuthenticated:false});
      }
      throw error;

      }
      },
    
    setEmail: (email) => set({email}),
    signup : async(data) => {
         set({isLoading:true, error:null, message:""})
       try {
        const res = await authApi.post("/signup", data)
        set({user : res.data?.user, isAuthenticated:true, message:res.data.message})

       } catch (error) {
        let errMessage = "USER_SIGNUP_FAILED"
        if(axios.isAxiosError(error)){
            errMessage = error.response?.data?.message || error.response?.data?.errors[0].msg ||  errMessage
        } else if (error instanceof Error) {
             errMessage = error.message || errMessage
        }
        set({error: errMessage, message:""})
        throw error;
       } finally {
         set({isLoading:false})
       }

    },

    

    verifyEmail : async(code) => {
      set({error:null, isLoading:true, message:""})
      try {
         let res = await authApi.post("/verify-email", {code})
         if(res.data === "EXPIRED_VERIFICATION_CODE") {
          res = await get().tryToRefreshAccessToken(code);
         }
         set({isAuthenticated:true, message:res?.data?.message, accessToken:""})
      } catch (error) {
         let errMessage = "USER_VERIFICATION_FAILED"
      if(axios.isAxiosError(error)) {
         errMessage = error.response?.data?.message || error.response?.data?.errors[0].msg || errMessage;
      }
      else if(error instanceof Error) {
         errMessage = error?.message || errMessage;
      }
      set({error:errMessage, message:""})
      throw error;
      }
      finally {
         set({isLoading:false})
       }
    },

    login : async(data) => {
    set({isLoading:true, error:null, message:""})
     try {
      const res = await authApi.post("/login", data)
      set({user:res?.data?.user, isAuthenticated:true, message:res.data.message})
     } catch (error) {
      let errMessage = "USER_LOGIN_FAILED"
      if(axios.isAxiosError(error)) {
         errMessage = error.response?.data?.message || error.response?.data?.errors[0].msg || errMessage
      }
      else if(error instanceof Error) {
         errMessage = error?.message || errMessage;
      }
      set({error:errMessage, message:""})
      throw error;
     } 
     finally {
         set({isLoading:false})
       }
    },

   forgotPassword : async(email) => {
      set({isLoading:true, error:null, message:""})
    try {
      const res = await authApi.post("/forgot-password", {email})
      set({message:res.data?.message, isSubmitted:true })
    } catch (error) {
      let errMessage = "ERROR_FORGETTING_PASSWORD";
      if(isAxiosError(error)){
      errMessage = error?.response?.data?.message || error?.response?.data?.errors[0].msg || errMessage
      } else if(error instanceof Error) {
         errMessage = error?.message || errMessage;
      }
      set({error:errMessage, message:""})
      throw error;
    } finally {
         set({isLoading:false})
       }
    },


    checkAuth: async() => {
        set({error:null, message:"", isCheckingAuth:true})
        try {
            const res = await authApi.get("/checkAuth")
           set({user:res.data?.user, isAuthenticated:true})
        } catch (error) {
           set({error:null, message:""})
        } finally {
         set({isCheckingAuth:false})
       }
    },


    resetPassword : async(password, token) => {
     set({isLoading:true, error:null,message:""})
     try {
      const res = await authApi.put(`/reset-password/${token}`, {password})
      set({message:res?.data?.message, isLoading:false, error:null})
     } catch (error:any) {
      const errMessage = error?.response?.data?.message 
      || error?.response?.data?.errors[0]?.msg 
      || error?.message || "Error_RESETING_PASSWORD";
      set({error:errMessage, isLoading:false})
      throw error;
     }
    },

    logout : async() => {
      set({isLoading:true, error:null})
      try {
      const res = await authApi.post("/logout");
      set({message:res.data?.message || "",  isAuthenticated:false, error:null})
      get().disconnectSocket()
      } catch (error) {
         set({user:null, error:"USER_LOGING_FAILED", message:""});
         throw error;
      } finally{
         set({isLoading:false})
      }
    },

    updateProfile : async(data) => {
      set({error:null, message:"", isUpdatingProfile:true})
      try {
         const res = await authApi.put("/update-profile", data);
         const {isOnboarding} = get()
         set({user:res?.data?.user, isUpdatingProfile:false,
             message: !isOnboarding ? res?.data?.message[0]
             : res?.data?.message[1]   })
      } catch (error) {
         let errMsg = "PROFILE_UPDATING_FAILED"
         if(isAxiosError(error)){
            errMsg = error?.response?.data?.message || error?.response?.data?.errors[0]?.msg || errMsg
         } else if(error instanceof Error){
            errMsg = error?.message || errMsg
         }
         set({error:errMsg, message:""})
         throw error;
      } finally{
         set({isUpdatingProfile:false, isLoading:false})
      }
    } ,

    warmUp: async() => {
     const res = await authApi.get("/warm-up");
     return res.data;
    },


    connectSocket : () => {
      const authUser = get().user
      if(!authUser || get().socket?.connected) return;
      const socket = io("http://localhost:8000", {
         withCredentials:true,
         query : {
            userId : authUser._id
         }
      })

      socket.on("connect", () => console.log("socket is connected"));
      socket.on("getOnlineUsers", (usersId: string[]) => {
       set({onlineUsers : usersId})
      })
      socket.on("disconnect", () => {
         console.log("socket is disconnected");
        
      })

      set({socket:socket})
    },
    disconnectSocket : () => {
      if(get().socket?.connected){
         get().socket?.disconnect()
      }
    },
    
   }))


    