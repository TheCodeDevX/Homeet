

 import { Loader2, SendHorizonalIcon, UserMinus, UserPlusIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useListingStore } from '../store/listingStore';
import clsx from 'clsx';
import { useAuthStore } from '../store/auhStore';

 interface FollowButtonProps  {
  isFollowing :boolean
  handleFollowReq : () => void
  handleNavigation : () => void
  isReqLoading:boolean
  size?: string
  fontSize? : string
  }
 
 const FollowButton = ({isFollowing, handleFollowReq, handleNavigation, isReqLoading, size, fontSize} 
  : FollowButtonProps) => {
    const {t} = useTranslation();;
    
   return (
     <>
    {
    !isFollowing ?
    (  <button onClick={handleFollowReq}
    className={`btn  ${fontSize} max-sm:w-full btn-outline rounded-xl border border-base-content/20  ${isReqLoading ? "cursor-wait" : "cursor-pointer"}`}>
    { isReqLoading ? (<>{t("buttons.following", {ns:"common"})} <Loader2 className={clsx( size , "animate-spin")}/></>) : 
    (<>{t("buttons.follow", {ns:"common"})} <UserPlusIcon className={clsx(size)}/></>)}
    </button>) : (
    <button onClick={handleFollowReq}
    className={`btn max-sm:w-full ${fontSize} btn-active bg-base-100 text-base-content
    border-base-content/10 shadow-sm shadow-base-content/50 hover:shadow-base-300
    hover:bg-base-content border hover:border-base-300 hover:text-base-300 rounded-xl
    ${isReqLoading ? "cursor-wait" : "cursor-pointer"}
    `}>

    { isReqLoading ? (<>{t("buttons.unfollowing", {ns:"common"})}
    <Loader2 className={clsx( size , "animate-spin")}/></>) : 
    (<>{t("buttons.unfollow", {ns:"common"})} <UserMinus className={clsx( size)}/></>)}
    </button>) 

    }
    <button onClick={handleNavigation} className={clsx("btn max-sm:w-full btn-primary hover:btn-outline rounded-xl", fontSize)}>
                {t("buttons.message", {ns:"common"})} 
     <SendHorizonalIcon className={clsx( size)} />
     </button>
     </>

     
   )
 }
 
 export default FollowButton
 