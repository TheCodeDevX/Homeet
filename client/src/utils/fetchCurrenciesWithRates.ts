import { currencies } from "../constants";
import type { CurrencyCode } from "../types/types";

export const fetchCurrenciesWithRates = async(base_currency : CurrencyCode | undefined) => {
 if(!base_currency) return;
  const res = await fetch(`https://open.er-api.com/v6/latest/${base_currency}`)
  const data = await res.json()

 const updated : {
    rate: number;
    code: CurrencyCode;
    symbol: string;
    name: string;
}[] = currencies.map((c) => ({...c, rate : data.rates[c.code] ?? 1 }))
  return updated;
}

