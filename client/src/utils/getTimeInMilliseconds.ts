
 export const getTimeInMilliseconds = (date: string | undefined) : number => {
    if(!date) return 0;
    const time = new Date(date).getTime()
    if(isNaN(time)) return 0;  
    return time
 }