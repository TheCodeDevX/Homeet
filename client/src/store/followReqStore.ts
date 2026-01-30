import { create } from "zustand"

import { isAxiosError } from "axios"
import { FollowReqApi } from "../lib/axios.config"
import type { UserData } from "../../../backend/src/shared/types/types"
import { useNotificationStore } from "./notificationStore"

 type FollowRequestTypes = {
   sender: UserData,
   recipient : UserData,
    _id?:string
   } 

  interface FollowRequest {
   isReqLoading : boolean,
   isLoading : boolean,
   message : string,
   error : string | null,
   hasPendingFollowReq:boolean,
   isAlreadyFollowed:boolean,
   setIsAlreadyFollowed : (bool:boolean) => void,
   setHasPendingFollowReq : (isPending:boolean) => void, 
   followReq : FollowRequestTypes | null,
   followReqs : FollowRequestTypes[]
   sendFollowReq : (id : string, fqId?:string, userId?:string) => void,
   getIncomingRequests : () => Promise<any>
   // unfollowUser : (id:string) => Promise<any>
  }

  export const useFollowRequestStore = create<FollowRequest>((set, get) => ({
    isReqLoading : false,
    isLoading:false,
    isAlreadyFollowed:false,
    setIsAlreadyFollowed : (bool:boolean) => set({isAlreadyFollowed:bool}),
    message: "",
    error: null,
    followReq: null,
    followReqs : [],
    hasPendingFollowReq : true,
    setHasPendingFollowReq : (isPending) => set({hasPendingFollowReq:isPending}),
    sendFollowReq : async (id, notifId, userId) => {
      set({isReqLoading:true, error:null, message:""})
      //  set((state) => ({notifications: state.notifications.map((fq) => (
      //  fq?.toString() === fqIs?.toString() ? 
     
      //  ({...notif, sender : {...notif.sender, followers
      //  : existingFollowReq ? notif.sender.followers?.filter(followerId => followerId !== userId) ?? []
      //  : [...(notif.sender.followers ?? []), userId?.toString() ?? ""]
      //  }})
      //  : notif
      //   ))}))

     
      
     try {
        const res = await FollowReqApi.post(`/follow-request/${id}`);
        set({followReq: res.data?.followReq,
         isReqLoading:false,
          message:res.data?.message, 
          hasPendingFollowReq:res.data?.existingFollowReq 
          });

        const updatedNotifications = useNotificationStore.getState().notifications.map((notif) => (
        notif._id.toString() === notifId?.toString()  ?
         ({...notif, sender : {...notif.sender, followers
       : get().hasPendingFollowReq ? notif.sender.followers?.filter(followerId => followerId !== userId) ?? []
       : [...(notif.sender.followers ?? []), userId?.toString() ?? ""]
       }})
       : notif
        ));

       useNotificationStore.setState({notifications: updatedNotifications})
           
     } catch (error) {
        let errMsg = "FOLLOW_REQ_SENDING_FAILED";
        if(isAxiosError(error)) {
         errMsg = error?.response?.data?.message || errMsg;
        } else if (error instanceof Error) {
            errMsg = error?.message || errMsg
        }
        set({isReqLoading:false,error:errMsg})
        throw error;
     }
    
    },

    getIncomingRequests : async () => {
      set({isLoading:true, error:null})
    try {
        const res = await FollowReqApi.get("/follow-request")
        set({followReqs:res?.data})
    } catch (error) {
        let errMsg = "FOLLOW_REQ_RECEIVING_FAILED";
        if(isAxiosError(error)) {
         errMsg = error?.response?.data?.message || errMsg;
        } else if (error instanceof Error) {
            errMsg = error?.message || errMsg
        }
       set({error:errMsg})
        throw error;
       
     }
     finally {
        set({isLoading:false})
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