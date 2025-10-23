import { Camera, Loader, PenBox } from "lucide-react"
import {useForm, type SubmitHandler} from 'react-hook-form'
import { useAuthStore, type ProfileData } from "../store/auhStore"
import DotAnimation from "../components/DotAnimation"
import {useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import {motion} from 'framer-motion'
import avatar from '../assets/avatar.png'
import { useTranslation } from "react-i18next"
import e from "cors"
import toast from "react-hot-toast"


 
 const ProfilePage = () => {
  const {t} = useTranslation()
  const [progress, setProgress] = useState(0)
  const {updateProfile, isLoading, message, error, user, setIsOnBoarding} = useAuthStore()

  const {register, setValue, trigger, handleSubmit, reset,
     formState : {isSubmitting, errors}, getValues} = useForm<ProfileData>();

           useEffect(() => {
             if(user) {
                 reset({
             firstName: user?.firstName ?? "",
             lastName:user?.lastName ?? "",
             bio:user?.bio ?? "",
             profilePic: user?.profilePic ?? avatar,
             address: user?.address ?? "",
             phoneNumber: user?.phoneNumber ?? "",
            email: user?.email ?? "",
            role: user?.role ?? "",
            currency :  user?.currency ?? ""
             })
             }
            }, [user, reset])
         


  const handleUploadImage = (e:ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const fileList = e.target.files;
    if(!fileList) return;
    const file = fileList[0]
    if(!file.type.startsWith("image/")) return console.error("please select an image file!");
    const reader = new FileReader();
    reader.onload = async() => {
      const imagebase64 = reader.result?.toString();
      setValue("profilePic", imagebase64, {shouldValidate:true})
      trigger("profilePic")

    };
     reader.readAsDataURL(file);
    reader.onprogress = async(e) => {
      if(e.lengthComputable) {
        const percent = (e.loaded / e.total) * 100;
        setProgress(percent)
      }
    }
    reader.onloadend = async() => setTimeout(() => setProgress(0), 2000)
  }

//   type T = {
//     name: string;
// }
//  const obj : T["name"] = {name : "Omar"}

  
 

 
  
   const OnSubmit : SubmitHandler<ProfileData> = async(data, e:FormEvent<HTMLFormElement>) => {
   e.preventDefault();

    setIsOnBoarding(false)
    try {
       await updateProfile(data)
    } catch (error) {
      console.error(error)
    }
   }

  //   const messages = t("backendMessages", {ns:"messages", returnObjects:true}) as Record<string , string>
  // const msg = messages[message ?? "default"];
  // const errMsg = messages[error ?? "default"]
   return (
   <>

    {/* <ToastMessage msg={error ? errMsg : msg }
    msgType={ !error && !message ? "" : message ? 'success' : error ? "error" : ""}/> */}

     <div className="h-auto w-full relative  mt-24">
       <div className="relative max-w-3xl w-full mx-auto space-y-0 p-4 ">
        <form onSubmit={handleSubmit(OnSubmit)}
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
                        <motion.div 
                        style={{maskComposite: "exclude",
                           mask:"linear-gradient(black, black), linear-gradient(black, black)",
                            maskOrigin:"content-box",
                       }}
                         transition={{duration:1}}
                         animate={{background: `conic-gradient(white ${progress * 3.6}deg, transparent 0deg)`}}
                         className="flex items-center justify-center p-1 rounded-full">
                          <div className={`avatar select-none pointer-events-none rounded-full
                           size-32 overflow-hidden border-2 border-base-content/50
                          `} >
                        <img src={getValues().profilePic} alt="Profile" />
                    </div>
                        </motion.div>
                    <label className="absolute cursor-pointer right-0 bottom-1 bg-base-300 p-2 rounded-full
                       border border-base-content/20
                        hover:bg-base-100 hover:border-base-content/30 transition-colors duration-200">
                        <Camera/>
                         <input type="file" accept="image/*" className="hidden"
                           onChange={handleUploadImage}
                        /> 
                     
                    </label>
                  
                    </div>
                    
                    {errors.profilePic ? (<p className="text-red-500 text-xs font-semibold mt-2">
                          {errors?.profilePic.message}</p>) : 
                           <div className="text-xs mt-2"> {progress ? (<div className="flex items-center !text-sm">
                            uploading <p className="flex gap-1"><DotAnimation/></p></div>)
                      : (<p>
                        {t("info", {ns:"profile"})}
                      </p>)} </div> }
                </div>

                <div className="space-y-8 w-full relative ">
                   <div className="flex sm:flex-row flex-col items-center justify-center gap-4 w-full h-full">
                    <div className="sm:w-1/2 w-full relative ">
                      {errors.firstName && (<p className="text-red-500 text-xs font-semibold mt-2 absolute
                     left-0 top-full">
                        {errors?.firstName.message}</p>) }
                         <label className="space-y-2 flex flex-col ">
                      <span className="label-text">
                        {t("labels.firstName", {ns:"common"})}
                      </span>
                      <input type="text" className="input input-bordered" 
                      placeholder={t("labels.firstName", {ns:"common"})}
                      {...register("firstName", {required: t("backendMessages.FIRST_NAME_REQUIRED", {ns:"messages"})})} />
                    </label>
                    </div>
                  

                   <div className="sm:w-1/2 w-full relative">
                    {errors.lastName && (<p className="text-red-500 text-xs font-semibold mt-2 absolute left-0 top-full ">
                        {errors?.lastName.message}</p>) }
                     <label className="space-y-2 flex flex-col ">
                      <span className="label-text">
                              {t("labels.lastName", {ns:"common"})}
                      </span>
                      <input type="text" className="input input-bordered" 
                           placeholder={t("labels.lastName", {ns:"common"})}
                       {...register("lastName", {required:   t("backendMessages.LAST_NAME_REQUIRED", {ns:"messages"})})} />
                      
                    </label>
                    
                   </div>
                   </div>

                 <div>
                      <label className="space-y-2 flex flex-col ">
                      <span className="label-text">
                              {t("labels.email", {ns:"common"})}
                      </span>
                      <input type="text" className="input input-bordered"
                       placeholder={t("labels.email", {ns:"common"})}
                      {...register("email", {required :   t("backendMessages.EMAIL_REQUIRED", {ns:"messages"})})} />
                     
                    </label>
                     {errors.email && (<p className="text-red-500 text-xs font-semibold mt-2">
                        {errors?.email.message}</p>) }
                 </div>

                   <div>
                     <label className="space-y-2 flex flex-col ">
                      <span className="label-text">
                              {t("labels.phoneNumber", {ns:"common"})}
                      </span>
                      <input type="text" className="input input-bordered"
                       placeholder={t("labels.phoneNumber", {ns:"common"})}
                       {...register("phoneNumber", {required : t("backendMessages.PHONE_NUMBER_REQUIRED", {ns:"messages"})})} />
                    </label>
                      {errors.phoneNumber && (<p className="text-red-500 text-xs font-semibold mt-2">
                        {errors?.phoneNumber.message}</p>) }
                   </div>

                      <label className="space-y-2 flex flex-col ">
                      <span className="label-text">
                              {t("labels.address", {ns:"common"})}
                      </span>
                      <input type="text" className="input input-bordered"
                      placeholder={t("placeholders.address", {ns:"common"})}
                      {...register("address")}
                      />
                    </label>
                    
                    <label className="space-y-2 flex flex-col ">
                      <span className="label-text">
                              {t("labels.bio", {ns:"common"})}
                      </span>
                      <textarea  placeholder={t("placeholders.bio", {ns:"common"})}
                      className="textarea textarea-bordered resize-none"
                        {...register("bio")} />
                    </label>

                      <label className="space-y-2 flex flex-col ">
                    <span className="label-text">
                            {t("labels.currency.label", {ns:"common"})}
                    </span>
                    <select {...register("currency")} defaultValue="usd" className='select select-bordered w-full'
                    >
                   {/* <option disabled value=""> {t("labels.currency.placeholder", {ns:"common"})}</option> */}

                <option value="usd">{t("labels.currency.dollar.name", {ns:"common"})}</option>
                  <option value="eur">{t("labels.currency.euro.name", {ns:"common"})}</option>
                  <option value="gbp">{t("labels.currency.pound.name", {ns:"common"})}</option>
                  <option value="jpy">{t("labels.currency.yen.name", {ns:"common"})}</option>
                  <option value="cad">{t("labels.currency.cad.name", {ns:"common"})}</option>
                  <option value="aud">{t("labels.currency.aud.name", {ns:"common"})}</option>
                  <option value="chf">{t("labels.currency.chf.name", {ns:"common"})}</option>
                  <option value="cny">{t("labels.currency.yuan.name", {ns:"common"})}</option>
                  <option value="sar">{t("labels.currency.sar.name", {ns:"common"})}</option>
                  <option value="aed">{t("labels.currency.aed.name", {ns:"common"})}</option>
                  <option value="egp">{t("labels.currency.egp.name", {ns:"common"})}</option>
                  <option value="mad">{t("labels.currency.mad.name", {ns:"common"})}</option>
                  <option value="brl">{t("labels.currency.brl.name", {ns:"common"})}</option>
                  <option value="inr">{t("labels.currency.inr.name", {ns:"common"})}</option>
                  <option value="try">{t("labels.currency.try.name", {ns:"common"})}</option>
                  <option value="zar">{t("labels.currency.zar.name", {ns:"common"})}</option>
                  <option value="sgd">{t("labels.currency.sgd.name", {ns:"common"})}</option>
                  <option value="hkd">{t("labels.currency.hkd.name", {ns:"common"})}</option>

                  </select>
                  </label>

                    <label className="space-y-2 flex flex-col ">
                    <span className="label-text">
                            {t("labels.gender.label", {ns:"common"})}
                    </span>
                    <select {...register("gender")} className='select select-bordered w-full'
                    >
                   <option disabled value="placeholder"> {t("labels.gender.placeholder", {ns:"common"})}</option>
                   <option value="male"> {t("labels.gender.options.male", {ns:"common"})}</option>
                   <option value="female"> {t("labels.gender.options.female", {ns:"common"})}</option>
                  </select>
                  </label>

                   <label className="space-y-2 flex flex-col ">
                    <span className="label-text">
                      {t("labels.role.label", {ns:"common"})}
                    </span>
                    <select {...register("role", {required : "Role is required"})} className='select select-bordered w-full'
                    >
                   <option disabled value="">
                       {t("labels.role.placeholder", {ns:"common"})}
                   </option>
                   <option value="tenant">
                     {t("labels.role.options.tenant", {ns:"common"})}
                   </option>
                   <option value="seller">
                        {t("labels.role.options.seller", {ns:"common"})}
                   </option>
                   <option value="homeowner">
                        {t("labels.role.options.homeowner", {ns:"common"})}
                    </option>
                  </select>
                  </label>

                   <button disabled={isSubmitting} type="submit" className="btn w-full btn-primary ">
                    {!isSubmitting ? (<>
                        {t("buttons.updateProfile", {ns:"common"})}
                    <PenBox/></>) : (
                                  <><Loader className="animate-spin text-center mx-auto size-5"/></>
                 )}</button>
                </div>
        </form>
       </div>
     </div>
     </>
   )
 }
 
 export default ProfilePage
 