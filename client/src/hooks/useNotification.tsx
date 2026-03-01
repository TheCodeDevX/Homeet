import { NotificationContext } from "../context/createdContexts/NotificationContext"
import { useCustomContext } from "../utils/useCustomContext"

 
 const useNotification = () => {
  return useCustomContext(NotificationContext, 'useNotification')
 }
 
 export default useNotification
 