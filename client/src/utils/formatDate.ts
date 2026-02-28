
 export function formatDate (date : string){
  if(!date) return null
  return new Date(date).toLocaleTimeString("en-Us", {
    hour : "2-digit",
    minute : "2-digit",
    hour12: true,
  })
 }

