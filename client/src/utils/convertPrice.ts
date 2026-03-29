
import type { CurrencyCode } from "../types/types"

 export function convertPrice(
originalPrice:number,
originalCurrency:CurrencyCode | undefined,
userCurrency : CurrencyCode | undefined,
currencies: {
    rate: number;
    code: CurrencyCode;
    symbol: string;
    name: string;
}[]
) {
 if(!originalCurrency || !userCurrency) return;
 const userCurrencyRate = currencies.find((c) => c.code === userCurrency)?.rate
 const calculatedPrice = +(originalPrice * (userCurrencyRate ?? 0)).toFixed(2) 
 console.log(currencies.find((c) => c.code === userCurrency)?.rate, userCurrencyRate, calculatedPrice)
 return calculatedPrice

 }
 
