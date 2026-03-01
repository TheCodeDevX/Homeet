import type { Dispatch, SetStateAction } from "react";
import * as types from "../../../backend/src/shared/types/types"
import type { NavigateFunction } from "react-router-dom";
import type { Socket } from "socket.io-client";
import type { AxiosResponse } from "axios";

 export interface AuthData {

    user : types.UserData | null
    isAuthenticated : boolean
    isLoading : boolean
    isNavigateToSignupPage :boolean
    setIsNavigateToSignupPage : (value:boolean) => void
    isCheckingAuth : boolean
    error : string | null
    message : string
    isOnboarding: boolean,
    isUpdatingProfile:boolean,
    setIsOnBoarding : (value : boolean ) => void
    isSubmitted : boolean
    email : string,
    profilePic: string,
    accessToken:string,
    socket : Socket | null
    onlineUsers : string[]
    setEmail : (email:string) => void;
    signup : (data : SignupData) => Promise<void>
    login : (data : LoginData) => Promise<void>
    forgotPassword : (email:string) => Promise<void>;
    logout : () => Promise<void>
    verifyEmail : (code : string) => Promise<void>
    resetPassword : (password:string, token:string) => void;
    checkAuth : () => Promise<void>
    updateProfile : (data : types.ProfileData) => Promise<void>
    warmUp : () => void, 
    connectSocket : () => void,
    disconnectSocket : () => void;
    tryToRefreshAccessToken : (code:string) => Promise<AxiosResponse<{success : boolean, message : string}>>
 }

 export interface SidebarContextProps {
     isOpen : boolean
     handleSidebarOpen : () => void
     setIsOpen : React.Dispatch<SetStateAction<boolean>>
  }


export interface SliceTextParameters {
  text:string,
  threshold: number,
  splitAt: string,
  joinAt: string,
  start:number,
  end:number | undefined,
  extra:string
}

export interface NotificationStates {
notificationsLength : number
setNotificationsLength : (length:number) => void;
}

 export interface DirStates {
    langDir : string,
    setLangDir : React.Dispatch<SetStateAction<string>>
 }


export interface NavigationProps {
  listingUser:types.UserData | undefined,
  setSelectedUser: (selectedUser: types.UserData | null) => void,
  navigate:NavigateFunction
}

export interface FollowReqProps {
  recipientId : types.ID | undefined,
  userId: types.ID | undefined,
  sendFollowReq:(id: string, notifId?:string, userId?:string) => void, 
  setIsFollowing?: Dispatch<SetStateAction<boolean>>,
  notifId?:string, 
}

 

export type LoginData = Pick<types.UserData, "email" | "password">
export type SignupData = Pick<types.UserData, "firstName" | "lastName" | "email" | "password">

export interface ErrorHandlerParameters {error : unknown, defaultErr : string}