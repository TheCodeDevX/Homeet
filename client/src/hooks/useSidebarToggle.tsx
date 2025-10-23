import { SidebarContext } from "../context/SidebarProvider"
import { customContext } from "../utils/customContext"


 export const useSidebarToggle = () => {
  return customContext(SidebarContext, "useSidebarContext")
  }