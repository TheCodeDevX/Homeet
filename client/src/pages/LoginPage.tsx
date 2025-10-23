import {motion} from 'framer-motion'
import Input from '../components/Input'
import {Eye, EyeClosed, Loader, Lock, Mail, Shield} from 'lucide-react'
import {useState, type ChangeEvent, type FormEvent } from 'react'
import Button from '../components/Button'
import AuthButton from '../components/AuthButton'
import {FaFacebookF, FaGoogle} from 'react-icons/fa'
import { useAuthStore, type UserData } from '../store/auhStore'
import { Link, useNavigate } from 'react-router-dom'
import Light from '../components/Light'
import { useTranslation , Trans} from 'react-i18next'
import TinyHouse from '../assets/svg/tinyHouse'
import { lightThemes } from '../constants'
import { useThemeStore } from '../store/themeStore'

const LoginPage = () => {
  const {t} = useTranslation()
  const navigate = useNavigate();
  const {login, isLoading, error, user} = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
 

  const [formState, setFormState] = useState<Pick<UserData, "email" | "password">>({
    email : "",
    password : "",
  })

  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    const {value, name} = e.target;
    setFormState((prev) => ({...prev, [name] : value}))
  }

  
  const handleSubmit = async(e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
     login(formState)
    } catch (error) {
      console.log(error)
    }
  }

  const google = () => window.open("http://localhost:8000/api/auth/google", "_self")
  const facebook = () => window.open("http://localhost:8000/api/auth/facebook", "_self")

  const {theme} = useThemeStore()

  return (
    <motion.div
    initial={{opacity:0, y:20}}
    animate={{y:0, opacity:1}}
    transition={{duration:0.5}}
    className='relative max-w-6xl mx-auto backdrop-filter backdrop-blur-xl rounded-[40px]
    bg-base-300 flex flex-col lg:flex-row justify-between overflow-hidden
     p-6 border border-base-content/20 shadow-xl'>
       <Light color='bg-base-content/40' top='top-[80%]' left='left-[80%]'/>
       <Light color='bg-base-content/40' top='top-[80%]' left='right-[80%]'/>
      
    
          {/* Left Side */}
        <div className={`hidden  
         w-full lg:w-1/2 lg:flex items-center justify-center flex-col bg-gradient-to-b
          ${lightThemes.includes(theme) ? "from-primary/60 to-primary/50 border-base-content/30 " 
       : "from-primary/50 to-secondary/50 "} 
           rounded-[40px]`}>
            <div className="max-w-md p-8 flex flex-col text-center items-center justify-center ">
                <div className="relative aspect-square  max-w-sm mx-auto">
                    <div className="flex w-full h-full items-center justify-center">
                         <TinyHouse/>
                    </div>
                </div>
               <div className={`mt-2 ${lightThemes.includes(theme) ? "text-secondary-content" :"text-base-content"}`}>
                 <h1 className='text-3xl font-bold '>
                  {t("login.imageTitle", {ns:"auth"})}
                 </h1>
                 <h2 className='text-lg font-semibold '>
                   {t("login.imageSubtitle", {ns:"auth"})}
                 </h2>
               </div>
            </div>
        </div>

        {/* Right Side */}
         <div className='w-full lg:w-1/2 flex flex-col lg:items-start lg:px-20 px-10 max-lg:py-10 justify-center'>
         <div className='mb-2'>
            <h1 className='text-3xl font-bold bg-gradient-to-r text-transparent bg-clip-text
            from-base-content from-0% to-base-content/90 to-100%'>
                {t("login.title", {ns:"auth"})}
            </h1>

            <p className='text-base-content/60 '>
            <Trans i18nKey="login.q" ns='auth'
            components={{ a : <a href="/signup" className='text-primary font-semibold hover:underline'/>}}
            />
            </p>

         </div>
         <form onSubmit={handleSubmit} className="w-full">
           <div className="space-y-4 mt-4">
        
             
              <div className="w-full">
                <label>
                  <span className='label-text text-base-content/80'>
                    {t("labels.email", {ns:"common"})}
                  </span>
                  <Input autoComplete='email' type="email" name="email" placeholder={t("labels.email", {ns:"common"})}
                  value={formState.email} onChange={handleChange} icon={Mail} required />
               </label>
              </div>

              
            <div className="w-full">
                <label>
                  <span className={`label-text text-base-content/80`}>
                     {t("labels.password", {ns:"common"})}
                  </span>
                 <Input autoComplete='current-password' type={showPassword ? "text" : "password"} name="password"
                  value={formState.password} onChange={handleChange} onClickEye={() => setShowPassword(prev => !prev)}
                  placeholder={t("labels.password", {ns:"common"})} eyeIcon={showPassword ? Eye : EyeClosed} icon={Lock} required />
               </label>
                
              </div>

              <div className="w-full">
              <Link to="/forgot-password" className='hover:underline text-primary font-semibold'>
              {t("login.forgotPass", {ns:"auth"})}
              </Link>
              </div>
             
              <div className="w-full ">
                <Button>{isLoading ? <Loader className='size-5 animate-spin text-center mx-auto' />
                 : t("buttons.logIn", {ns:"common"}) }</Button>
              </div>
              
              <div className='flex items-center gap-2 '>
                <span className='h-px flex-1 bg-base-content/40'/>
                <p className='text-xs whitespace-nowrap text-center text-base-content/50 relative bottom-0.5'>
                 {t("login.or", {ns:"auth"})}
                </p>
                <span className='h-px flex-1 bg-base-content/40'/>
              </div>
            
           </div>
         </form>

           <div className="flex items-center gap-4 w-full mt-3">
               <AuthButton googleAuth={google} provider={t("buttons.google", {ns:"common"})} icon={FaGoogle}/>
               <AuthButton googleAuth={facebook}  provider={t("buttons.facebook", {ns:"common"})} icon={FaFacebookF}/>
          </div>
           
        </div>

     
    </motion.div>
  )
}

export default LoginPage
