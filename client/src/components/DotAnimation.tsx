
 import { Dot } from 'lucide-react'
 
 const DotAnimation = () => {
        return (
           <>
      {[...Array(3).fill("").map((_,i) => (
         <span key={i}
         className="w-1.5 animate-bounce duration-200 relative top-1" 
         style={{animationDelay: `${i * 150}ms`}}> <Dot/> </span> ))]}
         </>
        )

 }
 
 export default DotAnimation
 