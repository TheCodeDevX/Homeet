import {motion} from 'framer-motion'
import { useAuthStore } from '../store/auhStore'
import Input from '../components/Input'
import { ArrowLeft, Loader, Mail, SendHorizonal } from 'lucide-react'
import Button from '../components/Button'
import { Link } from 'react-router-dom'
import Light from '../components/Light'
import clsx from 'clsx'
import type { FormEvent } from 'react'
import { useTranslation } from 'react-i18next'

 const ForgotPassword = () => {
  const {t} = useTranslation()
    const {isSubmitted, email, setEmail, isLoading, error, forgotPassword} = useAuthStore()
    const handleSubmit = async(e:FormEvent<HTMLFormElement>) => {
     e.preventDefault();
     try {
      await forgotPassword(email)
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
    <h1 className='text-3xl font-bold text-base-content text-center'>
      {t("forgotPass.title", {ns:"auth"})}
    </h1>
      {!isSubmitted
      ? (<form onSubmit={handleSubmit} className='space-y-4'>
        <p className='text-base-content/80 text-center mt-6'>
          {t("forgotPass.subtitle", {ns:"auth"})}
          </p>
        <div className="w-full">
                <label>
                  <span className='label-text text-base-content/80 '>
                     {t("labels.email", {ns:"common"})}
                  </span>
                  <Input iconClasses={clsx(error && "!text-red-200 transition-colors duration-200 ")}
                   classes={clsx(error && "!bg-red-500/10 !border-2 !border-red-500 !text-red-200 placeholder-red-500 transition-colors duration-200")}
                  type="email" name="email" placeholder={t("labels.enterEmail", {ns:"common"})}
                  value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} required />
                  {/* {error && <p className='text-red-500 text-[12px] font-semibold mt-2'>{error}</p>} */}
               </label>
        </div>
          <div className="w-full">
                <Button classes='!py-3 flex items-center justify-center gap-2'>{isLoading ?
                 <Loader className='size-5 animate-spin text-center mx-auto' /> : <>
                 {t("buttons.sendResetLink", {ns:"common"})}
                  <SendHorizonal/> </> } </Button>
              </div>
                
      </form>) 
      : (<>
      <div className="flex flex-col w-full items-center justify-center text-center">
        <motion.div  
        initial={{scale:0}}
        animate={{scale:1, transition:{ type:"spring", damping:50, stiffness:500, delay:0.2, duration:1 }}}
        className='bg-gradient-to-b  from-primary/50 to-secondary p-4 w-fit rounded-full my-6'
        >
        <Mail className='size-8 text-base-content'/>
        </motion.div>

        <p className='text-base-content'> {t("forgotPass.msg", {ns:"auth"}).split("-")[0]}
            <span className='text-primary font-semibold'> 
              { email ? t("forgotPass.msg", {ns:"auth", email : email}).split("-")[1] : "Email"}
              </span> {t("forgotPass.msg", {ns:"auth"}).split("-")[2]}</p>

             
      </div>
      </>)} 

     
     </div>
      <div className={`p-4 bg-base-100 border-t border-t-base-content/20 text-base-content`}>
       <Link to="/login" className='flex items-center justify-center gap-2
        hover:underline hover:underline-offset-2'> <ArrowLeft className='size-5'/>
        {t("buttons.goback", {ns:"common"})}
        </Link>
      </div>
     </motion.div>
   )
 }
 
 export default ForgotPassword
 