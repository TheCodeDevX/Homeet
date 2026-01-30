import { NotificationContext } from "../context/NotificationProvider"
import { customContext } from "../utils/customContext"

 
 const useNotification = () => {
  return customContext(NotificationContext, 'useNotification')
 }
 
 export default useNotification
 