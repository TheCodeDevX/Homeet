import CountUp from 'react-countup'
import { currencies, prefixCurrencySymbols } from '../constants'
import type { ApiData, PricingType } from '../store/listingStore'
import { t } from 'i18next'
import { useEffect, useRef, useState } from 'react'
import { convertPrice } from '../utils/convertPrice'
import { useAuthStore } from '../store/authStore'
import type { CurrencyCode } from '../types/types'
import { fetchCurrenciesWithRates } from '../utils/fetchCurrenciesWithRates'
import clsx from 'clsx'
import i18n from '../config/reacti18next'

interface PriceProps {
    listing : ApiData | null,
    price?: number | undefined,
    isDynamic : boolean,
    textSize?: "sm" | "large"
    classes?: string,
} 

 const Price = ({ listing, price, isDynamic, textSize = "large" }: PriceProps) => {
 
  const authUser = useAuthStore().user
  const userCurrency = authUser?.currency?.toUpperCase() as CurrencyCode
  const bookingCurrency = listing?.price.currency
  const targetPrice = isDynamic ? price ?? 0 : listing?.price?.amount_local || 0

   const prevCurrencyRef = useRef<CurrencyCode>(bookingCurrency)
  const [convertedPrice, setConvertedPrice] = useState(0);
  const [currenciesWithRates, setCurrenciesWithRates] = useState<{
    rate: number;
    code: CurrencyCode;
    symbol: string;
    name: string;
}[] | undefined>();

  useEffect(() => {
  const fetchCurrencies = async () => {
    const result = await fetchCurrenciesWithRates(bookingCurrency)
    setCurrenciesWithRates(result)
  }
  fetchCurrencies()
  }, [bookingCurrency])


  useEffect(() => {
      const price = convertPrice(+targetPrice, bookingCurrency, userCurrency, currenciesWithRates ?? [])
      setConvertedPrice(price ?? 0)
  }, [targetPrice, bookingCurrency, userCurrency, currenciesWithRates])
  const prevPriceRef = useRef<number>(convertedPrice)
 
  const isPrefixCurrencySymbol = prefixCurrencySymbols.includes(authUser?.currency?.toUpperCase() as string)

  const getPropertyCategory = (pricingType: PricingType | undefined) => {
    if (!pricingType) return
    switch (pricingType) {
      case "monthly":  return t(`card.categories.monthly`,  { ns: "card" })
      case "nightly":  return t(`card.categories.nightly`,  { ns: "card" })
      case "one_time": return t(`card.categories.one_time`, { ns: "card" })
      default:         return t(`card.categories.placeholder`, { ns: "card" })
    }
  }

 

  useEffect(() => { 
    prevPriceRef.current = convertedPrice
   }, [convertedPrice])

   useEffect(() => {
    prevCurrencyRef.current = userCurrency
   }, [userCurrency])

   const isArabic = i18n.language === "ar"

  return (
    <div className={clsx("flex", textSize === "sm" 
    ? "flex-row items-baseline justify-start gap-2" 
    : "flex-col justify-center items-center gap-1")}>
      <div className="flex items-center justify-center">
        {isPrefixCurrencySymbol && !isArabic && (
          <span className={clsx(
            textSize === "sm" ? "text-sm" : "sm:text-3xl text-xl text-base-content/80",
            "font-bold -mb-0.5"
            )}>
            {currencies.find(c => c.code === userCurrency)?.symbol}
          </span>
        )}

        <span className={
          clsx("font-black tabular-nums tracking-tight", textSize === "sm" 
            ? "sm:text-lg text-sm" : "sm:text-4xl text-2xl text-base-content" )
        }>
         <CountUp
            start={prevPriceRef.current}
            end={Number(convertedPrice)}
            duration={1.5}
            decimals={2}
            separator=","
          />
          
        </span>

        { isArabic &&
        <span className={clsx(
            textSize === "sm" ? "text-sm" : "sm:text-xl text-lg text-base-content/80",
            "font-bold -mb-0.5"
            )}>
            {t(`currencies.${userCurrency}`, {ns : "common"})}
        </span>
        }

        {!isPrefixCurrencySymbol && !isArabic && (
          <span className={clsx(
            textSize === "sm" ? "text-sm" : "sm:text-3xl text-xl text-base-content/80",
            "font-bold -mb-0.5"
            )}>
             {currencies.find(c => c.code === userCurrency)?.code}
          </span>
        )}
      </div>

      <span className={
        clsx("font-medium tracking-widest uppercase leading-none",
          textSize === "sm" ? "text-[11px] opacity-80" : "text-sm text-base-content/80"
        )
      }>
        {isDynamic
          ? t("labels.totalPrice", { ns: "common" })
          : getPropertyCategory(listing?.pricingType)}
      </span>
    </div>
  )
}

export default Price