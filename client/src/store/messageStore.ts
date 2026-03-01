import { create } from "zustand";
import { useAuthStore } from "./authStore";
import type {MessageData, UserData} from '../../../backend/src/shared/types/types'
import { AudioApi, MessageApi } from "../lib/axios.config";
import { errorHandler } from "./helpers/errorHelper";
 

 interface MessageStates {
    users : UserData[]
    selectedUser : UserData | null
    setSelectedUser : (selectedUser: UserData | null) => void
    isMessagesLoading : boolean,
    isMessagesSending : boolean,
    isUsersLoading : boolean,
    setIsUserLoading : (bool : boolean) => void
    error : string | null,
    messages : MessageData[]
    getUsers : ({shouldLoad} : {shouldLoad : boolean}) => void
    getMessages : (id:string ) => void
    uploadAudio : (blob: Blob, receiverId:string | undefined, senderId : string) => void
    sendMessages : (id : string , data : MessageData) => void
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
    getUsers : async({shouldLoad}) => {
        set({isUsersLoading:shouldLoad, error:null})
        try {
            const res = await MessageApi.get("/users");
            set({users: res.data })
            return res.data;

        } catch (error) {
            const err = errorHandler({error, defaultErr : "USERS_FETCHING_FAILED"})
            set({error:err})
            throw error
        } finally{
            set({isUsersLoading:false})
        }
     },

    getMessages : async(id) => {
        set({isMessagesLoading:true, error:null})
        try {
            const res = await MessageApi.get(`/messages/${id}`)
            set({messages:res?.data?.messages})
        } catch (error) {
            const err = errorHandler({error, defaultErr: "MESSAGES_FETCHING_FAILED"})
            set({error:err})
            throw error;
        } finally{
            set({isMessagesLoading:false})
        }
    },

    sendMessages : async(id , data) => {
    set({error:null, isMessagesSending:true})
    try {
    const res = await MessageApi.post(`/send-messages/${id}`, data)
    set(state => ({messages : [...state.messages, res.data?.message ]}));
    } catch (error) {
    const err = errorHandler({error, defaultErr:"MESSAGES_SENDING_FAILED"})
    set({error:err})
    throw error;
    } finally{
    set({isMessagesSending:false})
    }
    },

    uploadAudio : async (blob : Blob, receiverId, senderId) => {
    const formData = new FormData();
    formData.append("audio", blob, "recording.webm")
    formData.append("senderId", senderId)
    try {
    if(blob.size === 0) throw new Error("EMPTY_AUDIO_RECORDING")
    if(!blob || !(blob instanceof Blob)) throw new Error("INVALID_AUDIO_RECORDING")    
    const res = await AudioApi.post(`/upload-audio/${receiverId}`, formData) 
    if(!(res?.data?.success)) {
    set(state => ({ messages : [...state.messages]}))
    return;
    }
    set(state => ({ messages : [...state.messages, res.data?.message] }))
    } 
    catch (error) {
    const err = errorHandler({error, defaultErr: "FAILED_UPLOADING_AUDIO"})
    set({error : err}) 
    throw error
    }
    },

    registerMessage : (newMessage:MessageData) => {
      const user = useAuthStore.getState().user
       const selectedUser = get().selectedUser
        try {
        if(!user || !selectedUser) throw new Error("INVOLVED_USERS_NOT_FOUND");
        const isRelevant = 
        newMessage.senderId?.toString() === user._id && newMessage.receiverId?.toString() === selectedUser._id ||
        newMessage.senderId?.toString() === selectedUser._id && newMessage.receiverId?.toString() === user._id
        if(!isRelevant) throw new Error('IRRELEVANT_USERS');
        set((state) => ({messages : [...state.messages, newMessage]}))
        } catch (error) {
        const err = (error as Error)?.message 
        set({error : err})
        throw error
        }
    },

     subToMessages : () => {
        const socket = useAuthStore.getState().socket
        const registerMessage = get().registerMessage
        socket?.on("newMessage", registerMessage)
     },
     
     unsubFromMessages : () => {
     const {registerMessage} = get()
     const {socket} = useAuthStore.getState()
     socket?.off("newMessage", registerMessage)
     },
 }))