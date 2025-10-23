import { Check } from "lucide-react"
import { useThemeStore } from "../store/themeStore"
import { lightThemes } from "../constants"

 
 const Checkbox = () => {
  const {theme} = useThemeStore()
   return (
   <div>
      
   <label className="cursor-pointer inline-block scale-75">
       <input type="checkbox" aria-label="Toggle Checkbox" className="opacity-0 rounded-full size-8 
       absolute inset-0 peer" required  />
     <span className="size-8 rounded-full shadow-[-1px_-1px_5px_rgba(225,225,225,0.1)] border border-base-content/10
      bg-base-content/10 flex items-center justify-center hover:scale-95 
        peer-checked:text-base-content transition text-transparent
      " >
        <Check className="absolute size-4"/>
        <span className={`size-6 rounded-full flex items-center justify-center
         shadow-[inset_-1px_-1px_5px_rgba(225,225,225,0.2),inset_4px_4px_10px_rgba(0,0,0,.2)]

         ${lightThemes.includes(theme) ? "bg-transparent" : "bg-base-200"}
        `}/>
     </span>
    </label>

</div>
   )
 }
 
 export default Checkbox
 