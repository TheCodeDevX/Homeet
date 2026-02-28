import { NotificationContext } from "../context/NotificationProvider"
import { useCustomContext } from "../utils/useCustomContext"

 
 const useNotification = () => {
  return useCustomContext(NotificationContext, 'useNotification')
 }
 
 export default useNotification
 