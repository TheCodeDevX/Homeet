
import { useAuthStore, type UserData } from '../store/auhStore'
import avatar from '../assets/avatar.png'
import clsx from 'clsx'
import i18n from '../config/reacti18next'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ToolTip from './ToolTip'
 
 const UserProfile = ({user, isBtn} : {user : UserData | null, isBtn?:boolean}) => {
    
    const lang = i18n.language;
    const {t} = useTranslation()
    const navigate = useNavigate();
    
    const ProfilePicture = () => {
      return (
      <>
         <div onClick={() => isBtn && navigate(`/profile/${user?._id}`, {state:user?._id})}
       className={`${isBtn ? "cursor-pointer size-14" : "cursor-default size-10"}
         rounded-full border-2 border-primary/50 group`}>
        <img src={user?.profilePic || avatar} 
        onError={(e) => e.currentTarget.src = avatar}
         alt="Avatar" rel="noreferrer"/>
        { location.pathname.startsWith("/listings") && <ToolTip isMobile/>}
      </div>
      
      </>
      )
    }
    
    
   return (
    
    <div className="p-4 mt-auto bottom-8">
       <div className="flex items-center gap-2">
         <div className="avatar">
            <ProfilePicture/>
        </div>

        <div className="flex-1">
            <p className='text-md font-bold text-base-content'>{user?.firstName}</p>

               <div className='relative flex items-center'>
                 <span className={clsx('text-xs font-semibold relative text-green-600',
                  lang === "ar" ? "mr-4" : "ml-4"
                 )}>
                  {t("status.online", {ns:"status"})}
                 </span>
                 <span className='absolute inline-block size-2.5 bg-green-600 rounded-full animate-ping'/>
                 <span className='absolute inline-block size-2.5 bg-green-600 rounded-full'/>
               </div>
        </div>
       </div>
    </div>
   )
 }
 
 export default UserProfile
 