import { SidebarContext } from "../context/SidebarProvider"
import { useCustomContext } from "../utils/useCustomContext"


 export const useSidebarToggle = () => {
  return useCustomContext(SidebarContext, "useSidebarContext")
  }