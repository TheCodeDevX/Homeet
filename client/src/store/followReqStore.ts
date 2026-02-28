import { create } from "zustand"

import { FollowReqApi } from "../lib/axios.config"
import type { UserData } from "../../../backend/src/shared/types/types"
import { useNotificationStore } from "./notificationStore"
import { errorHandler } from "./helpers/errorHelper"

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
   followReq : FollowRequestTypes | null,
   followReqs : FollowRequestTypes[]
   sendFollowReq : (id : string, fqId?:string, userId?:string) => void,
   getIncomingRequests : () => void
  }

  export const useFollowRequestStore = create<FollowRequest>((set) => ({
    isReqLoading : false,
    isLoading:false,
    message: "",
    error: null,
    followReq: null,
    followReqs : [],
    hasPendingFollowReq : true,
    sendFollowReq : async (id, notifId, userId) => {
      set({isReqLoading:true, error:null, message:""})
     try {
        const res = await FollowReqApi.post(`/follow-request/${id}`); // the recipient here is who has sent
        // a follow request.
        set({
          followReq: res?.data?.followReq,
          isReqLoading:false,
          message:res?.data?.message, 
          hasPendingFollowReq:res?.data?.existingFollowReq 
          });

       if(notifId){
          // we used notifId only in the notification page
        const updatedNotifications = useNotificationStore.getState().notifications.map((notif) => (
        notif?._id?.toString() === notifId?.toString()  ?
        ({...notif, sender : {...notif?.sender, followers
        : notif?.sender?.followers?.includes(userId ?? "" as string)
        ? notif?.sender?.followers?.filter(followerId => followerId !== userId) ?? []
        : [...(notif?.sender?.followers ?? []), userId?.toString() ?? ""]
        }})
        : notif
        ))
        useNotificationStore.setState({notifications: updatedNotifications})
        }
           
     } catch (error) {
        const err = errorHandler({error, defaultErr:"FOLLOW_REQ_SENDING_FAILED"})
        set({isReqLoading:false,error:err})
        throw error;
     }
    
    },

    getIncomingRequests : async () => {
      set({isLoading:true, error:null})
     try {
        const res = await FollowReqApi.get("/follow-request")
        set({followReqs:res?.data, isLoading:false})
    } catch (error) {
       const err = errorHandler({error, defaultErr :'FOLLOW_REQ_RECEIVING_FAILED'})
        set({error:err, isLoading : false});
        throw error;
     }
    }
  }))