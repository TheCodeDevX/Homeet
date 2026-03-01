
 import { X } from 'lucide-react'

import i18n from '../config/reacti18next'
 
 const CloseButton = ({handleClose} : {handleClose: () => void}) => {
  const lang = i18n.language;
   return (
      <button onClick={handleClose}
       className={`absolute ${lang === 'ar' ? "left-4" : "right-4"} p-1 rounded-full hover:bg-error hover:text-base-100
       transition-colors duration-200`}>
        <X/>
      </button>
   )
 }
 
 export default CloseButton
 