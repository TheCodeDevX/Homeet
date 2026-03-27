import {motion} from 'framer-motion'
import { AlertTriangle } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next';

const Modal = ({onShowModal, onConfirm, titleKey, subtitleKey}: {
  onShowModal : Dispatch<SetStateAction<boolean>>; onConfirm: (p:any) => void, titleKey:string, subtitleKey:string}) => {
  const {t} = useTranslation()
 
  return (
   <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.25 }}
  className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/30 p-4"
  onClick={() => onShowModal(false)}
>
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 8 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.2, type: "spring", damping: 24, stiffness: 260 }}
    className="w-full max-w-sm rounded-2xl overflow-hidden bg-base-100 border border-base-content/10"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Body */}
    <div className="px-6 pt-6 pb-5 flex flex-col items-center text-center gap-2">
      <div className="size-11 rounded-full bg-error/10 flex items-center justify-center mb-1">
        <AlertTriangle className="size-5 text-error" />
      </div>
      <h2 className="text-base font-semibold text-base-content">
        {t(titleKey, { ns: "modals" })}
      </h2>
      <p className="text-sm text-base-content/60 leading-relaxed">
        {t(subtitleKey, { ns: "modals" })}
      </p>
    </div>

    {/* Actions */}
    <div className="flex border-t border-base-content/10">
      <button
        onClick={() => onShowModal(false)}
        className="flex-1 py-3 text-sm font-medium text-base-content/50
          hover:bg-base-200 transition-colors duration-150
          border-r border-base-content/10"
      >
        {t("Modal.actions.cancel", { ns: "modals" })}
      </button>
      <button
        onClick={onConfirm}
        className="flex-1 py-3 text-sm font-semibold text-error
          hover:bg-error/10 transition-colors duration-150"
      >
        {t("Modal.actions.confirm", { ns: "modals" })}
      </button>
    </div>
  </motion.div>
</motion.div>
  )
}

export default Modal
