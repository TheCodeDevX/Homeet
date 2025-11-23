import { useTranslation } from "react-i18next"

 const ToolTip = ({isMobile} : {isMobile?:boolean}) => {
  const {t} = useTranslation()
   return (
    <span className={` ${isMobile ? "group-hover:opacity-100 group-hover:visible z-10 text-xs" 
        : "peer-hover:opacity-100 peer-hover:visible max-sm:hidden text-sm"} transition-opacity duration-300 opacity-0 invisible
    absolute top-full -translate-x-1/2 left-1/2 whitespace-nowrap
    px-2 py-1.5 bg-base-100 text-base-content border border-primary/20 rounded-xl
    `}>
    {t("tooltips.VIEW_PROFILE", {ns:"tooltips"})}
    </span>
   )
 }
 
 export default ToolTip
 