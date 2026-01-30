import { create } from "zustand";
import type { UserData } from "../../../backend/src/shared/types/types";
import { NotifsApi } from "../lib/axios.config";
import { isAxiosError } from "axios";
import { useAuthStore } from "./auhStore";
import { useFollowRequestStore } from "./followReqStore";


 interface Notification {
    _id: string,
    sender : UserData,
    recipient : UserData,
    status : "new" | "read" | "archived",
    type : "FOLLOW_REQ" | "BOOKING" | "MESSAGE",
    readAt : string,
    state : "upcoming" | "loaded"
    archivedAt: string,
    deletedAt: string,
    createdAt?: string,
    updatedAt?: string,
 }

 interface NotificationStates {
    notification : Notification | null,
    notifications : Notification[],
    newNotificationIds : string[],
    isLoading : boolean,
    isNotifLoading : boolean,
    error : string | null,
  notifIds : string[]
    currentPage : number,
    setCurrentPage : (page:number) => void
    setNotifications : (Notifications: Notification[]) => void,
    getIncomingNotifs : () => void,
    markAsRead : (notifIds?: string[]) => void
    markAsArchived : (notifIds?: string[]) => void
    deleteArchivedNotifs : (ids? : string[]) => void
 }

 export const useNotificationStore = create<NotificationStates>((set, get) => ({
  notification: null,
  notifications: [],
  newNotificationIds : [],
  isLoading: false,
  isNotifLoading : false,
  currentPage : 1,
  notifIds : [],
  setCurrentPage : (page) => set({currentPage: page}),
  setNotifications : (notifications) => set({notifications}),
  error: null,
  getIncomingNotifs : async () => {
  set({isLoading:true, error:null})

  try {
    const page = get().currentPage
    const response = await NotifsApi.get(`/?page=${page}&limit=${5}`)
    set(state => ({isLoading:false,
    notifications : state.currentPage > 1 ? [
        ...state.notifications, 
      ...response.data.incomingNotifs, 
    
    ] : response.data.incomingNotifs}))

  } catch (error) {
    let errMessage = "error fetching notifications";
    if(error instanceof Error){
    errMessage = error.message || errMessage
    } else if (isAxiosError(error)) {
     errMessage = error.response?.data.message || errMessage  
    }
    set({error:errMessage, isLoading:false})
    throw error
  }
  },
  markAsRead : async (ids) => {
    set({isNotifLoading:true, error:null})
   try {
    // set((state) => ({notifications : state.notifications.filter((n) => ids.includes(n._id))
    //   .map((notif) => ({...notif, status: "read"})) }))

    const res = await NotifsApi.put("/read-notifs", {notifIds:ids});
    set((state) => ({ isNotifLoading : false, 
      notifIds:res.data.notifIds }))
     
   } catch (error) {
    let errMessage = "error updating notifications";
    if(error instanceof Error){
    errMessage = error.message || errMessage
    } else if (isAxiosError(error)) {
     errMessage = error.response?.data.message || errMessage  
    }
    set({error:errMessage, isNotifLoading:false})
    throw error;
   }  
  },
   markAsArchived : async (ids) => {
    set({error:null})
   try {
    await NotifsApi.post("/archive-notifs", {notifIds:ids});

   } catch (error) {
    let errMessage = "error updating notifications";
    if(error instanceof Error){
    errMessage = error.message || errMessage
    } else if (isAxiosError(error)) {
     errMessage = error.response?.data.message || errMessage  
    }
    set({error:errMessage, isNotifLoading:false})
    throw error;
   }  
  },

    deleteArchivedNotifs : async (ids) => {
    set({error:null})
   try {
    await NotifsApi.post("/delete-archived-notifs", {ids});

   } catch (error) {
    let errMessage = "error updating notifications";
    if(error instanceof Error){
    errMessage = error.message || errMessage
    } else if (isAxiosError(error)) {
     errMessage = error.response?.data.message || errMessage  
    }
    set({error:errMessage, isNotifLoading:false})
    throw error;
   }  
  }
 }))