import type { Dispatch, SetStateAction } from "react";
import type { NavigateFunction } from "react-router-dom";
import type { Socket } from "socket.io-client";
import type { AxiosResponse } from "axios";

export type ProfileData = {
    firstName: string;
    lastName: string;
    email: string;
    gender: "" | "male" | "female";
    phoneNumber: string;
    role: "tenant" | "homeowner" | "seller" | "none";
    profilePic?: string;
    bio?: string;
    currency?: CurrencyUnion;
    address?: string;
}


export interface MessageData {
  text?:string
  image?:string
  audio?: string
  senderId?:string
  receiverId?:string
  _id?:string,
  audioDuration?: number,
  createdAt?: string,
  updatedAt?: string,
 }



 export interface AuthData {

    user : UserData | null
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
    updateProfile : (data : ProfileData) => Promise<void>
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

 export type UserRole = Pick<UserData, "role">["role"];



export interface FollowReqProps {
  recipientId : string | undefined,
  userId: string | undefined,
  sendFollowReq:(id: string, notifId?:string, userId?:string) => void, 
  setIsFollowing?: Dispatch<SetStateAction<boolean>>,
  notifId?:string, 
}

 export type CurrencyUnion = "usd" | "eur" | "gbp" | "jpy" | "cad" | "aud" | "chf" | "cny" | "sar" | "aed" | 
 "egp" | "mad" | "brl" | "inr" | "try" | "zar" | "sgd" | "hkd";

 
 export type SubscriptionUnion = "unsubscibed" | "subscribed" | "pending"

export type UserData = {
  // Required
  firstName: string
  lastName: string
  email: string
  password: string
  gender: "male" | "female" | ""
  phoneNumber: string
  role: "tenant" | "homeowner" | "seller" | "none"

  // Optional
  _id?: string
  createdAt?: string
  googleId?: string
  facebookId?: string
  profilePic?: string
  isVerified?: boolean
  onBoarded?: boolean
  bio?: string
  currency?: CurrencyUnion
  address?: string
  followers?: string[]
  isSubscribed?: SubscriptionUnion
  verificationToken?: number
}

export type SelectedUser = Pick<UserData, "firstName" | "lastName" | "_id" | "profilePic">

 export interface NavigationProps {
  listingUser: SelectedUser | undefined
  setSelectedUser: (selectedUser: SelectedUser | null) => void
  navigate:NavigateFunction
}

export type TrendStatus = "positive" | "negative" | "neutral" | 'n/a'
export interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  icon: React.ComponentType<{ size: number }>
  trend?: {
    value: number | 'N/A'
    trendStatus: TrendStatus
  }
  color?: string
}

export type LoginData = Pick<UserData, "email" | "password">
export type SignupData = Pick<UserData, "firstName" | "lastName" | "email" | "password">

export interface ErrorHandlerParameters {error : unknown, defaultErr : string}

export type StatusEnum = "active" | "inactive"

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" |
 "CNY" | "SAR" | "AED" | "EGP" | "MAD" | "BRL" | "INR" | "TRY" | "ZAR" | "SGD" | "HKD"
