
 interface LightProps {
  top?: string
  left?:string
  color: string
 }

 const Light = ({top, left, color} : LightProps) => {
   return (
     <div
      aria-hidden="true"
      className={`rounded-full -z-50 ${top} ${left} absolute opacity-20 blur-3xl size-80 ${color} lg:hidden block `}>
     </div>
   )
 }
 
 export default Light
 