import {Types, Document} from "mongoose";

 export type CurrencyUnion = "usd" | "eur" | "gbp" | "jpy" | "cad" | "aud" | "chf" | "cny" | "sar" | "aed" | 
 "egp" | "mad" | "brl" | "inr" | "try" | "zar" | "sgd" | "hkd";

 export type SubscriptionUnion = "unsubscibed" | "subscribed" | "pending"

 export type ID = string | Types.ObjectId
 
  export interface UserDocument extends Document {
   _id : ID,
   createdAt : string,
   googleId : string,
   facebookId : string,
   firstName : string,
   lastName : string ,
   email : string,
   password: string,
   profilePic : string,
   isVerified : boolean,
   onBoarded : boolean,
   bio : string,
   gender : "male" | "female" | "",
   currency :  CurrencyUnion,
   address : string,
   phoneNumber : string,
   role : "tenant" | "homeowner" | "seller" | "none",
   followers : string[],
   isSubscribed : SubscriptionUnion,
   lastLogin : Date,
   resetPasswordToken : string,
   resetPasswordExpiresAt : Date,
   verificationToken : number,
   verificationTokenExpiresAt : Date,
   refreshToken : string,
   refreshTokenExpiresAt: Date,
   matchPassword : (pass : string) => Promise<boolean>
  }

  export interface ErrorType {
    message: string;
    name: string;
    stack: string | undefined;
    code: number | undefined;
    statusCode: number;
    type: string;
}

// shared types

export type RequiredFields = Required<Pick<UserDocument,
"firstName" | "lastName" | "email" | "password" | "gender" | "phoneNumber" | "role">>

export type OptionalFields =  Pick<{[k in keyof UserDocument]?: UserDocument[k]}, "isVerified" | "verificationToken"
| "onBoarded" | "_id" | "bio" | "address" | "profilePic" | "currency" | "createdAt" | "googleId" | "followers" >


export type UserData = RequiredFields & OptionalFields

export type UserRole = Pick<UserData, "role">["role"];

export type ProfileData =  Pick<UserData, "firstName" | "lastName" | "bio" | "email" | "role" | "phoneNumber" 
| "currency" | "profilePic" | "address" | "gender" 
>
export type MinimalResponse =  Pick<AuthResponse, 'success' | "message">

// Responses 

type UserDataUnion = keyof UserData
export interface UserResponse {
user : Pick<UserDocument, UserDataUnion> 
}

export interface AuthResponse {
  user : Pick<UserData, '_id' | 'googleId'>
  message : string
  success : boolean
}

export interface ProfileResponse {
  success : boolean,
  message : string[],
  missingFields : (string | false)[],
  user : ProfileData
  }
export type LogoutResponse =  MinimalResponse
export type VerifyEmailResponse = MinimalResponse
// {
//     firstName:string,
//     lastName: string ,
//     email: string,
//     password: string
//     isVerified? : boolean,
//     verificationToken?: number,
//     onBoarded? : boolean,
//     _id?:string,
//     followers : string[]
    
//  } & {bio?:string, gender?: "male" | "female" | "", address?:string ,
//     phoneNumber?:string, profilePic?:string, 
//    role: UserRole, currency?: string  }