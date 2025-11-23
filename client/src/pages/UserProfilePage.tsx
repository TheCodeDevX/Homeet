import {useForm} from 'react-hook-form'
import { useAuthStore, type ProfileData } from "../store/auhStore"
import {useEffect, useRef, useState} from "react"
import { useTranslation } from "react-i18next"
import {  useParams } from "react-router-dom"
import { useUserStore } from '../store/userStore'
import { useMessageStore } from '../store/messageStore'
import avatar from "../assets/avatar.png"
import LoadingSpinner from '../components/Spinner'


 
 const UserProfilePage = () => {
  const {t} = useTranslation()
const {user, getUser, isUserLoading} = useUserStore()
const {user:authUser} = useAuthStore()
const {messages, getMessages, isMessagesLoading} = useMessageStore()
const inputRef = useRef<HTMLInputElement>(null)
const [isAuth, setIsAuth] = useState(false)


 

  const {id} = useParams();

   useEffect(() => {
    if(user?._id){
    getMessages(user?._id as string)
    }
   }, [user?._id])

   useEffect(() => {
   if(id) {
   getUser(id);
   }
   }, [id])

   useEffect(() => {
    setIsAuth(messages.some((msg) => msg.senderId?.toString() === authUser?._id));
   }, [user, messages, authUser])

   
   

 

    console.warn(messages, "messages")



   
         


  

//   type T = {
//     name: string;
// }
//  const obj : T["name"] = {name : "Omar"}

  
 

 
  
   

  console.log(isAuth, "isAuthorized")

  const splitSensitiveField = (field : keyof Pick<ProfileData, "email" | "phoneNumber">) => {
  if(!user) return;
    const fieldValue = user[field] as string;
   const slicedChars : number = field === "email" ? 2 : 3;
  
  if(field === "email") {
   const splitedField = (i:number) => fieldValue?.split("@")[i]
   const stars =  [Array(splitedField(0).length - slicedChars).fill("*").map((item) => item).join("")]
    return  isAuth ? user[field] :  splitedField(0).slice(0,2) + stars + splitedField(1);
  }
  return isAuth ?  fieldValue : "*".repeat(fieldValue.length - slicedChars) + fieldValue.slice(-3) 
  }


  const handleUnspecifiedFields = (field : keyof ProfileData) => {
    if(!user) return;
    const filedValue = user[field]
    if(!filedValue || filedValue.trim() === "") return "Unspecified"
    return filedValue;
  }

  if(isUserLoading || isMessagesLoading ) return <LoadingSpinner/>

   return (
   <>

    {/* <ToastMessage msg={error ? errMsg : msg }
    msgType={ !error && !message ? "" : message ? 'success' : error ? "error" : ""}/> */}

     <div className="h-auto w-full relative  mt-24">
       <div className="relative max-w-3xl w-full mx-auto space-y-0 p-4 ">
        <form 
         className="bg-base-300 rounded-xl shadow-sm border border-base-content/20 p-6 space-y-4">
           <div className="text-center">
                <h1 className="lg:text-4xl text-3xl font-black mb-2">
                  {t("title", {ns:"profile"})}
                </h1>
                <p className="lg:text-md text-sm">{t("subtitle", {ns:"profile"})} </p>
               </div>

               {/* Profile Picture */}
               
                <div className="flex flex-col items-center">
                    <div className="relative">
                       
                          <div className={`avatar select-none pointer-events-none rounded-full
                           size-32 overflow-hidden border-2 border-base-content/50
                          `} >
                        <img src={user?.profilePic} alt="Profile" />
                    </div>
                       
        
                  
                    </div>
                    
                    
                </div>

                <div className="space-y-8 w-full relative ">
                   <div className="flex sm:flex-row flex-col items-center justify-center gap-4 w-full h-full">
                    <div className="sm:w-1/2 w-full relative ">
                    
                         <label className="space-y-2 flex flex-col ">
                      <span className="label-text">
                        {t("labels.firstName", {ns:"common"})}
                      </span>
                      <div className="input input-bordered flex items-center text-center">
                      {user?.firstName}  
                      </div> 
                      
                    </label>
                    </div>
                  

                   <div className="sm:w-1/2 w-full relative">
                   
                     <label className="space-y-2 flex flex-col ">
                      <span className="label-text">
                              {t("labels.lastName", {ns:"common"})}
                      </span>
                       <div className="input input-bordered flex items-center text-center">
                      {user?.lastName}  
                      </div> 
                      
                    </label>
                    
                   </div>
                   </div>

                 <div>
                      <label className="space-y-2 flex flex-col ">
                      <span className="label-text">
                              {t("labels.email", {ns:"common"})}
                      </span>
                       <div className="input input-bordered flex items-center text-center">
                      {splitSensitiveField('email') ?? ""}  
                      </div> 
                     
                    </label>
                    
                 </div>

                   <div>
                     <label className="space-y-2 flex flex-col ">
                      <span className="label-text">
                              {t("labels.phoneNumber", {ns:"common"})}
                      </span>
                      <div className="input input-bordered flex items-center text-center">
                     {splitSensitiveField("phoneNumber") ?? ""} 
                      </div> 
                    </label>
                      
                   </div>

                      <label className="space-y-2 flex flex-col ">
                      <span className="label-text">
                              {t("labels.address", {ns:"common"})}
                      </span>
                        <div className={`input input-bordered flex items-center text-center
                          ${user?.address?.trim() === "" ? "text-base-content/50 text-sm" : "text-base-content"}
                          `}>
                         {handleUnspecifiedFields("address")}
                      </div> 
                    </label>
                    <label className="space-y-2 flex flex-col ">
                      <span className="label-text">
                              {t("labels.bio", {ns:"common"})}
                      </span>
                       <div className={`input input-bordered h-[100px] flex p-2.5
                         ${user?.bio?.trim() === "" ? "text-base-content/50 text-sm" 
                         : "text-base-content text-xs"}
                        `}>
                      <p className='line-clamp-5'>
                        {handleUnspecifiedFields("bio")}
                      </p>
                        
                      </div> 
                    </label>

                      <label className="space-y-2 flex flex-col ">
                    <span className="label-text">
                            {t("labels.currency.label", {ns:"common"})}
                    </span>
                    <div className="input input-bordered flex items-center text-center">
                     {handleUnspecifiedFields("currency")}
                      </div> 
                  </label>

                    <label className="space-y-2 flex flex-col ">
                    <span className="label-text">
                            {t("labels.gender.label", {ns:"common"})}
                    </span>
                   <div className="input input-bordered flex items-center text-center">
                     {handleUnspecifiedFields("gender")}
                      </div> 
                  </label>

                   <label className="space-y-2 flex flex-col ">
                    <span className="label-text">
                      {t("labels.role.label", {ns:"common"})}
                    </span>
                  <div className="input input-bordered flex items-center text-center">
                      {handleUnspecifiedFields("role")}  
                      </div> 
                  </label>

                  
                </div>
        </form>
       </div>
     </div>
     </>
   )
 }
 
 export default UserProfilePage
 