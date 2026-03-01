import { create } from "zustand";
import type { UserData } from "../../../backend/src/shared/types/types";
import { NotifsApi } from "../lib/axios.config";
import { errorHandler } from "./helpers/errorHelper";

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
  setNotifications : (notifications) => set({notifications}), // for testing
  error: null,
  getIncomingNotifs : async () => {
  set({isLoading:true, error:null})

  try {
    const page = get().currentPage
    const response = await NotifsApi.get(`/?page=${page}&limit=${5}`)
    set(state => ({isLoading:false,
    notifications : state.currentPage > 1 ? [
        ...(state.notifications || []), 
      ...(response.data?.incomingNotifs || []), 
    
    ] : response.data?.incomingNotifs || []}))

  } catch (error) {
    const err = errorHandler({error, defaultErr: 'FAILED_TO_FETCH_INCOMING_NOTIFICATIONS'})
    set({error:err, isLoading:false})
    throw error
  }
  },
  markAsRead : async (ids) => {
    set({isNotifLoading:true, error:null})
   try {
    const res = await NotifsApi.put("/read-notifs", {notifIds:ids});
    set({ isNotifLoading : false,  notifIds:res.data.notifIds })
     
   } catch (error) {
   const err = errorHandler({error, defaultErr:'FAILED_TO_READ_NOTIFICATION'})
    set({error:err, isNotifLoading:false})
    throw error;
   }  
  },
   markAsArchived : async (ids) => {
    set({error:null})
   try {
    await NotifsApi.post("/archive-notifs", {notifIds:ids});

   } catch (error) {
    const err = errorHandler({error, defaultErr:'FAILED_TO_ARCHIVE_NOTIFICATION'})
    set({error:err, isNotifLoading:false})
    throw error;
   }  
  },

    deleteArchivedNotifs : async (ids) => {
    set({error:null})
   try {
    await NotifsApi.post("/delete-archived-notifs", {ids});

   } catch (error) {
    const err = errorHandler({error, defaultErr:'FAILED_TO_DELETE_ARCHIVED_NOTIFICATIONS'})
    set({error:err, isNotifLoading:false})
    throw error;
   }  
  }
 }))