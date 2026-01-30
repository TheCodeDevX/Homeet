interface Props {
    text:string,
    threshold: number,
    splitAt: string,
    joinAt: string,
    start:number,
    end:number | undefined,
    extra:string
}
 
 export function sliceText({text, threshold, splitAt, joinAt, start, end, extra} : Props) {
    const splicedText = text.split(splitAt);
   if(splicedText.length > threshold) {
    return splicedText.slice(start,end ?? splicedText.length).join(joinAt) + extra;
   } else return text;
 }
 