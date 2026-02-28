import { currencies, prefixCurrencySymbols } from '../constants'
import type { ApiData, PricingType } from '../store/listingStore'
import { t } from 'i18next'

interface PriceProps {
    listing : ApiData | null,
    price?: number | undefined,
    isDynamic : boolean,
}

 const Price = ({listing, price, isDynamic} : PriceProps) => {
     const isPrefixCurrencySymbol = prefixCurrencySymbols.includes(listing?.user?.currency?.toUpperCase() as string)
     const getPropertyCateory = (pricingType : PricingType | undefined) => {
        if(!pricingType) return;
        switch(pricingType) {
         case "monthly" : return t(`card.categories.monthly`, {ns:"card"})
         case "nightly" : return t(`card.categories.nightly`, {ns:"card"})
         case "one_time" : return  t(`card.categories.one_time`, {ns:"card"})
         default : return t(`card.categories.placeholder`, {ns:"card"});
        }
     }

   return (
        <div className='flex items-center justify-center'>
            <p className="sm:text-3xl text-xl font-black line-clamp-1">
                <span className={`font-black`}>
                {isPrefixCurrencySymbol && currencies.find(c => c.code.toLowerCase()
                === listing?.user?.currency)?.symbol}
                </span>
                <span className={`font-black`}>{ isDynamic ? price : listing?.price }</span> 
                <span className={`font-black mx-1`}>
                {!isPrefixCurrencySymbol && currencies.find(c => c.code.toLowerCase()
                === listing?.user?.currency)?.symbol}
                </span>
     
            </p>
           { !isDynamic ?  <p className='sm:text-xl text-lg font-semibold opacity-80 '>
              { getPropertyCateory(listing?.pricingType) }
            </p> :
            <p className='md:text-md sm:text-sm text-xs font-semibold opacity-80 '>
            {t("labels.totalPrice", {ns : "common"})}
            </p>
        }

        </div>
   )
 }
 
 export default Price
 