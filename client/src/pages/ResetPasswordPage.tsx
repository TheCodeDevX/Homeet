import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom"
import Light from "../components/Light";
import {motion} from 'framer-motion'
import { useAuthStore } from "../store/auhStore";
import { Eye, EyeClosed, Loader, Lock, Shield } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import ToasterCompo from "../components/Toaster";

const ResetPasswordPage = () => {
  const {t} = useTranslation()
    const {token} = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {error, isLoading, resetPassword, message} = useAuthStore()


    const handleSubmit = async(e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(password !== confirmPassword) {
       toast.custom((toast) => (
        <ToasterCompo color="red" msg={t("clientMessages.ERROR_MATCHING_PASSWORDS", {ns:"messages"})} t={toast}/>
        ))
        return;
        }
       
        try {
         await  resetPassword(password, token)
          setTimeout(() => navigate("/login"), 3000)
        } catch (error) {
            console.error(error)
        }
    }
     
  return (
    <motion.div
     initial={{opacity:0, y:20}}
     animate={{opacity:1, y:0, transition:{duration:.5}}}
     className='w-full max-w-xl bg-base-300 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-[40px] shadow-xl 
     border border-base-content/20 overflow-hidden'
     >
          <Light color='bg-purple-500' top='-top-[45%]' left='left-1/2 -translate-x-[50%]'/>
     <div className="p-8">
    <h1 className='text-3xl font-bold text-base-content text-center mb-6'>
      {t("resetPass.title", {ns:"auth"})}
    </h1>
    <p className='text-base-content/80 text-center my-6'>
       {t("resetPass.subtitle", {ns:"auth"})}
    </p>
  

    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <div className="w-full">
        <label>
        <span className={`label-text text-base-content`}>
          {t("labels.password", {ns:"common"})}
        </span>
        <Input type={showPassword ? "text" : "password"}
         value={password} onChange={(e) => setPassword(e.target.value)} onClickEye={() => setShowPassword(prev => !prev)}
         placeholder={t("labels.password", {ns:"common"})} eyeIcon={showPassword ? Eye : EyeClosed} icon={Lock} required />

        </label>
          { <span className="text-xs text-primary flex items-center gap-1.5 mt-1.5"><Shield size={15}/>
          {t("login.info", {ns:"auth"})}
         </span> }
          
        </div>

        <div className="w-full pb-[22px]">
        <label>
        <span className={`label-text text-base-content`}>
              {t("labels.confirmPass", {ns:"common"})}
        </span>
        <Input type={showPassword ? "text" : "password"}
         value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onClickEye={() => setShowConfirmPassword(prev => !prev)}
         placeholder={t("labels.confirmPass", {ns:"common"})}
          eyeIcon={showConfirmPassword ? Eye : EyeClosed} icon={Lock} required />

        </label>
        
        </div>

        <div className="w-full ">
        <Button classes="!py-4">{isLoading ? <Loader className='size-5 animate-spin text-center mx-auto' />
         : <>{t("buttons.resetPass", {ns:"common"})}</>   }</Button>
        </div>
    </form>
    </div>
      
    </motion.div>
  )
}

export default ResetPasswordPage
