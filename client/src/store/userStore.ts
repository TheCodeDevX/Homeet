import { create } from "zustand";
import { errorHandler } from "./helpers/errorHelper";
import { UserApi } from "../lib/axios.config";
import type { UserData } from "../types/types";

 export interface UserProfile extends UserData {
   country?: string
}

 interface UserStates {
  user : UserProfile | null
  isUserLoading : boolean,
  error : string | null,
  getUser : (id:string) => void
 }


 export const useUserStore = create<UserStates>((set) => ({
  user: null,
  isUserLoading:false,
  error:null,
  getUser : async(id) => { 
  set({isUserLoading:true, error : null});
  try {
    const res = await UserApi.get(`/user/${id}`)
    set({user:res?.data, isUserLoading:false})
  } catch (error) {
    const err = errorHandler({error, defaultErr: "FETCH_USER_ERROR"})
    set({error:err, isUserLoading:false})
    throw error
  }
  }
 }))