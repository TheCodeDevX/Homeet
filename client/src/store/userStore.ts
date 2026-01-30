import { create } from "zustand";
import * as types from ".././../../backend/src/shared/types/types"
import { handleAxiosError } from "./helpers/errorHelper";
import { UserApi } from "../lib/axios.config";

 export interface UserProfile extends types.UserData {
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
  set({error:null, isUserLoading:true});
  try {
    const res = await UserApi.get(`/user/${id}`)
    set({user:res.data})
  } catch (error) {
    const errMessage = handleAxiosError(error)
    set({error:errMessage})
  } finally{
    set({isUserLoading:false})
  }
  }
 }))