
import type { CurrencyCode } from "../types/types"

 export function convertPrice(
bookingPrice:number,
bookingCurrency:CurrencyCode | undefined,
userCurrency : CurrencyCode | undefined,
currencies: {
    rate: number;
    code: CurrencyCode;
    symbol: string;
    name: string;
}[]
) {
 if(!bookingCurrency || !userCurrency) return;
 const userCurrencyRate = currencies.find((c) => c.code === userCurrency)?.rate
 return +(bookingPrice * (userCurrencyRate ?? 0)).toFixed(2) 

 }
 
