import { create } from "zustand";
import { useAuthStore, type UserData } from "./auhStore";
import { MessageApi } from "../lib/axios.config";
import axios, { isAxiosError } from "axios";
 interface MessageData {
    text?:string
    image?:string
    audio? : string
    senderId?:string | UserData
    receiverId?:string | UserData
    _id?:string,
    audioDuration? : number,
    createdAt?: string,
    updatedAt?: string ,
 }

 interface MessageStates {
    users : UserData[]
    selectedUser : UserData | null
    setSelectedUser : (selectedUser: UserData | null) => void
    isMessagesLoading : boolean,
    isMessagesSending : boolean,
    isUsersLoading : boolean,
    setIsUserLoading : (bool : boolean) => void
    error : string | null,
    addOrRemoveUser : (user: UserData) => void;
    messages : MessageData[]
    getUsers : (bool:boolean) => Promise<any>
    getMessages : (id:string ) => Promise<any>
    uploadAudio : (blob: Blob, receiverId:string | undefined, senderId : string | undefined) => Promise<any>
    // getAudio : (id:string) => Promise<any>
    sendMessages : (id : string , Msgdata : MessageData) => Promise<any>
    subToMessages : () => void
    unsubFromMessages : () => void
    registerMessage : (msg: MessageData) => void


 }

  

 export const useMessageStore = create<MessageStates>((set, get) => ({
    
    users : [],
    selectedUser: null,
    setSelectedUser : (selectedUser) => set({selectedUser}),
    messages : [],
    error:null,
    isUsersLoading:false,
    setIsUserLoading : (bool) => set({isUsersLoading:bool}) ,
    isMessagesLoading:false,
    isMessagesSending : false,
    addOrRemoveUser : async(user) => {
        
        if(user.onBoarded) {
        set(state => ({users: [...state.users, user]}))
        } else {
         set((state) => ({users : state.users.filter((u) => u._id !== user._id)}))
        }
       
    },
    getUsers : async(bool) => {
        set({isUsersLoading:bool, error:null})
        try {
            const res = await MessageApi.get("/users")
            set({users:res.data})
            return res.data;

        } catch (error) {
            let err = "USERS_FETCHING_FAILED"
            if(isAxiosError(error)) {
                err = error.response?.data?.message || err
            } else if (error instanceof Error) {
                err = error.message
            }
            set({error:err})
            return null;

        } finally{
            set({isUsersLoading:false})
        }
     },

     getMessages : async(id) => {
        if(!id) return;
        set({isMessagesLoading:true, error:null})
         try {
            const res = await MessageApi.get(`/messages/${id}`)
            set({messages:res.data?.messages})
            return res.data?.messages;

        } catch (error) {
              let err = "MESSAGES_FETCHING_FAILED"
            if(isAxiosError(error)) {
                err = error.response?.data?.message || err
            } else if (error instanceof Error) {
                err = error.message
            }
            set({error:err})
            throw error;

        } finally{
            set({isMessagesLoading:false})
        }
     },
     sendMessages : async(id , Msgdata) => {
        
        set({error:null, isMessagesSending:true})
      try {
            const res = await MessageApi.post(`/send-messages/${id}`, Msgdata)
                 set(state => ({messages : [...state.messages, res.data.message ]}))
                 
        } catch (error) {
              let err = "MESSAGES_SENDING_FAILED"
            if(isAxiosError(error)) {
                err = error.response?.data?.message || err
            } else if (error instanceof Error) {
                err = error.message
            }
            set({error:err})
            throw error;

        } finally{
            set({isMessagesSending:false})
        }
     },

     uploadAudio : async (blob : Blob, receiverId, senderId) => {
        if(!senderId) return;
   const formData = new FormData();
   formData.append("audio", blob, "recording.webm")
   formData.append("senderId", senderId)
  try {
   const res = await axios.post(`http://localhost:8000/api/uploading/upload-audio/${receiverId}`,
       formData, {withCredentials:true} )
    
      set(state => ({ messages : [...state.messages, res.data.message] }))
      
  } catch (error) {
   console.error("upload failed!",error)
  }
     },

     registerMessage : (newMessage:MessageData) => {
         const user = useAuthStore.getState().user
        const selectedUser = get().selectedUser
         if(!user || !selectedUser) return;
            const isRelevant = 
            newMessage.senderId?.toString() === user._id && newMessage.receiverId?.toString() === selectedUser._id ||
            newMessage.senderId?.toString() === selectedUser._id && newMessage.receiverId?.toString() === user._id

            if(!isRelevant) return;
            set((state) => ({messages : [...state.messages, newMessage]}))
        },

     subToMessages : () => {
        const socket = useAuthStore.getState().socket
        const registerMessage = get().registerMessage
        socket?.on("newMessage", registerMessage )
     },
     unsubFromMessages : () => {
     const {registerMessage} = get()
     const {socket} = useAuthStore.getState()
        socket?.off("newMessage", registerMessage)
     },
 }))