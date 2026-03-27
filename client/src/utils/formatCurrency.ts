import type { CurrencyCode } from "../types/types"


const currencyConfigs = {
  USD: { symbol: '$', position: 'prefix', decimals: 2, useShorthand: true },
  EUR: { symbol: '€', position: 'prefix', decimals: 2, useShorthand: true },
  GBP: { symbol: '£', position: 'prefix', decimals: 2, useShorthand: true },
  JPY: { symbol: '¥', position: 'prefix', decimals: 0, useShorthand: true },
  CAD: { symbol: '$', position: 'prefix', decimals: 2, useShorthand: true },
  AUD: { symbol: '$', position: 'prefix', decimals: 2, useShorthand: true },
  CHF: { symbol: 'CHF', position: 'prefix', decimals: 2, useShorthand: true },
  CNY: { symbol: '¥', position: 'prefix', decimals: 0, useShorthand: true },
  SAR: { symbol: 'SAR', position: 'suffix', decimals: 2, useShorthand: true },
  AED: { symbol: 'AED', position: 'suffix', decimals: 2, useShorthand: true },
  EGP: { symbol: 'EGP', position: 'suffix', decimals: 2, useShorthand: true },
  MAD: { symbol: 'MAD', position: 'suffix', decimals: 2, useShorthand: true },
  BRL: { symbol: 'R$', position: 'prefix', decimals: 2, useShorthand: true },
  INR: { symbol: '₹', position: 'prefix', decimals: 2, useShorthand: true },
  TRY: { symbol: '₺', position: 'prefix', decimals: 2, useShorthand: true },
  ZAR: { symbol: 'R', position: 'prefix', decimals: 2, useShorthand: true },
  SGD: { symbol: '$', position: 'prefix', decimals: 2, useShorthand: true },
  HKD: { symbol: '$', position: 'prefix', decimals: 2, useShorthand: true },
}

const formatShorthand = (value : number) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toFixed(2).toString()
}

export const formatCurrency = (price:number, currency:CurrencyCode | undefined) => {
   if(!currency) return;
  if (!currencyConfigs[currency]) return `${price} ${currency}` // fallback

  const { symbol, position, decimals, useShorthand } = currencyConfigs[currency]

  let displayPrice : string = price.toString()
  if (useShorthand) {
    displayPrice = formatShorthand(price)
  } else {
    displayPrice = price.toFixed(decimals)
  }

  return position === 'prefix' ? `${symbol}${displayPrice}` : `${displayPrice} ${symbol}`
}
