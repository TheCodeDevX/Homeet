import { SidebarContext } from "../context/createdContexts/SidebarContext"
import { useCustomContext } from "../utils/useCustomContext"


 export const useSidebarToggle = () => {
  return useCustomContext(SidebarContext, "useSidebarContext")
  }