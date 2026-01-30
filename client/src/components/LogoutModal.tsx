import {motion} from 'framer-motion'
import type { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next';

const LogoutModal = ({onShowModal, onLogout}: {onShowModal : Dispatch<SetStateAction<boolean>>; onLogout:() => void}) => {
  const {t} = useTranslation()
 
  return (
    <motion.div initial={{opacity:0}}
    animate={{opacity:1}}
    transition={{duration:0.5, type:"spring", damping:50, stiffness:200}}
     className='fixed inset-0 h-full backdrop-filter backdrop-blur-sm z-[9999999] text-center '>
     <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
     <div className="max-w-xl mx-auto shadow-2xl border rounded-2xl border-base-100/20 overflow-hidden
      bg-base-content text-base-300">
      <div className="px-8 py-4">
        <h2 className='text-red-500 font-semibold text-xl'>
        {t("logoutModal.logout", {ns:"modals"})}
        </h2>
       <p>
          {t("logoutModal.msg", {ns:"modals"})}
       </p>
      </div>
    
      
       <div className="flex border-t border-t-base-100/20">
        <button className='flex-1 border-r border-r-base-100/20 p-2 font-semibold
         hover:bg-error hover:text-base-300
         transition-colors duration-300 text-base-300/50' onClick={() => {
          document.body.style.overflow = 'auto';
          onShowModal(false);
          }}>
           {t("logoutModal.actions.cancel", {ns:"modals"})}
        </button>
        <button className='flex-1 text-blue-800 font-semibold p-2
          transition-colors duration-300 hover:bg-info/50' 
          onClick={onLogout}>
          {t("logoutModal.actions.confirm", {ns:"modals"})}
        </button>
       </div>
      </div>
    
     </div>
    </motion.div>
  )
}

export default LogoutModal
