import { createContext, useEffect, useState, type PropsWithChildren } from "react"
import { useFollowRequestStore } from "../store/followReqStore";

interface NotificationStates {
notificationsLength : number
setNotificationsLength : (length:number) => void;
}

export const NotificationContext = createContext<NotificationStates | undefined>(undefined)
 
 const NotificationProvider = ({children} : PropsWithChildren) => {
    const [notificationsLength, setNotificationsLength] = useState(0);
   return (
     <NotificationContext.Provider value={{notificationsLength, setNotificationsLength}}>
     {children}
     </NotificationContext.Provider>
   )
 }
 
 export default NotificationProvider
 