
import { useState } from 'react'
import * as types from '../../../backend/src/shared/types/types'
import { CopyCheckIcon, CopyIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import ToasterCompo from './Toaster';
import { t } from 'i18next';
import {AppError} from '../../../backend/src/utils/createError'

 interface ClipBoardComponentProps {
 field : string | undefined;
 isAuthorized : boolean,

 }

const ClipBoardComponent = ({field, isAuthorized} : ClipBoardComponentProps) => {
   
    const [isCopy, setIsCopy] = useState(false);
    if(!field || !isAuthorized) return;
  return (
    <div>
        <button type='button'
        onClick={async () => {
        try {   
        await navigator.clipboard.writeText(field);
        setIsCopy(true);
        setTimeout(() => setIsCopy(false), 3000);
        } catch (error) {
        console.error((error as AppError).message);
        toast.custom((toast) => (
         <ToasterCompo t={toast} msg={t("clientMessages.FAILED_COPYING_FIELD", {ns:"messages"})} color='red'/>
        ))
        }
        }} 
        className={`flex items-center justify-center gap-1.5 
        border text-xs p-1 cursor-pointer
        ${isCopy ? "border-primary/50 text-primary" : "border-base-content/50"}
        rounded hover:border-primary hover:bg-primary/10`}>
        {isCopy ? <> Copied <CopyCheckIcon size={16}/></> : <> Copy <CopyIcon size={16}/> </>}
        </button>
    
    </div>
  )
}

export default ClipBoardComponent
