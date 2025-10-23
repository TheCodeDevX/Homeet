import { create } from "zustand"
import type { UserData } from "./auhStore"
import { isAxiosError } from "axios"
import { FollowReqApi } from "../lib/axios.config"

 type FollowRequestTypes = {
   sender: UserData | null,
   recipient : UserData | null, _id?:string
   } 

  interface FollowRequest {
   isReqLoading : boolean,
   message : string,
   error : string | null,
   hasPendingFollowReq:boolean,
   setHasPendingFollowReq : (isPending:boolean) => void, 
   followReq : FollowRequestTypes | null,
   followReqs : FollowRequestTypes[]
   sendFollowReq : (id : string) => Promise<any>,
   getIncomingRequests : () => Promise<any>
   // unfollowUser : (id:string) => Promise<any>
  }

  export const useFollowRequestStore = create<FollowRequest>((set) => ({
    isReqLoading : false,
    message: "",
    error: null,
    followReq: null,
    followReqs : [],
    hasPendingFollowReq : true,
    setHasPendingFollowReq : (isPending) => set({hasPendingFollowReq:isPending}),
    sendFollowReq : async (id) => {
      set({isReqLoading:true, error:null, message:""})
     try {
        const res = await FollowReqApi.post(`/follow-request/${id}`);
        set({followReq: res.data?.followReq, message:res.data?.message, hasPendingFollowReq:res.data?.existingFollowReq
          })
     } catch (error) {
        let errMsg = "FOLLOW_REQ_SENDING_FAILED";
        if(isAxiosError(error)) {
         errMsg = error?.response?.data?.message || error.response?.data?.errors[0]?.msg || errMsg;
        } else if (error instanceof Error) {
            errMsg = error?.message || errMsg
        }
        set({error:errMsg})
        throw error;
     }
     finally {
        set({isReqLoading:false})
     }
    },

    getIncomingRequests : async () => {
      set({isReqLoading:true, error:null})
    try {
        const res = await FollowReqApi.get("/follow-request")
        set({followReqs:res?.data})
    } catch (error) {
        let errMsg = "FOLLOW_REQ_RECEIVING_FAILED";
        if(isAxiosError(error)) {
         errMsg = error?.response?.data?.message || error.response?.data?.errors[0]?.msg || errMsg;
        } else if (error instanceof Error) {
            errMsg = error?.message || errMsg
        }
       set({error:errMsg})
        throw error;
       
     }
     finally {
        set({isReqLoading:false})
     }
    },
   //  unfollowUser : async(id) => {
   //    set({isReqLoading:true, error:null, message:""})
   //    try {
   //       await FollowReqApi.delete(`/unfollow-request/${id}`)
   //    } catch (error) {
   //      throw error;
   //    } finally{
   //       set({isReqLoading:false})
   //    }
   //  }
  }))