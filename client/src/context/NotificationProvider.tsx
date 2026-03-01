import { useState, type PropsWithChildren } from "react"
import { NotificationContext } from "./createdContexts/NotificationContext";



 
 export const NotificationProvider = ({children} : PropsWithChildren) => {
    const [notificationsLength, setNotificationsLength] = useState(0);
   return (
     <NotificationContext.Provider value={{notificationsLength, setNotificationsLength}}>
     {children}
     </NotificationContext.Provider>
   )
 }
 

 