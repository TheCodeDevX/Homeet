import { create } from "zustand";
import type { UserData } from "./auhStore";
import { handleAxiosError } from "./helpers/errorHelper";
import { UserApi } from "../lib/axios.config";


 interface UserStates {
  user : UserData | null
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