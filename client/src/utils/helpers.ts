import type { Dispatch, SetStateAction } from "react";
import * as types from "../../../backend/src/shared/types/types"
import type { NavigateFunction } from "react-router-dom";
import { useFollowRequestStore } from "../store/followReqStore";

 interface NavigationProps {
 listingUser:types.UserData | undefined,
 setSelectedUser: (selectedUser: types.UserData | null) => void,
 navigate:NavigateFunction
}

interface FollowReqProps {
   recipientId : types.ID | undefined,
   userId: types.ID | undefined,
  sendFollowReq:(id: string, notifId?:string, userId?:string) => void, 
  setIsFollowing?: Dispatch<SetStateAction<boolean>>,
  setIsAlreadyFollowed?: (bool:boolean) => void,
  notifId?:string,
  
}

 export const handleNavigation = ({listingUser, setSelectedUser, navigate} : NavigationProps) => {
     if(listingUser){
       setSelectedUser(listingUser as types.UserData);
       navigate("/chat");
     }
}

export const handleFollowReq = async({userId, recipientId, notifId, 
  sendFollowReq, setIsFollowing, setIsAlreadyFollowed} : FollowReqProps) => {
    if(!recipientId) return;
    try {
     setIsAlreadyFollowed && setIsAlreadyFollowed( useFollowRequestStore.getState().isAlreadyFollowed ? false : true )
      await sendFollowReq(recipientId.toString(), notifId ?? "", userId?.toString());
     setIsFollowing && setIsFollowing(prev => !prev)
    } catch (error) {
      console.log(error)
    }
  }