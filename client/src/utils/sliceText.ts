import * as types from "../types/types"

export function sliceText({text, threshold, splitAt, joinAt, start, end, extra} : types.SliceTextParameters) {
if(!text) return "";    
const splicedText = text.split(splitAt);
if(splicedText.length > threshold) {
return splicedText.slice(start , end ?? splicedText.length).join(joinAt) + extra;
} else return text;

}
