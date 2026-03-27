import {describe, it, expect} from "vitest"
import "@testing-library/jest-dom/vitest"
import { convertPrice } from "./convertPrice"
import type { CurrencyCode } from "../types/types"




 describe('convertPrice', () => {
  // beforeEach(() => vi.resetAllMocks())
 it("converts the price based on the booking's currency",() => {
    const costPrice = convertPrice(100, "USD", "MAD", 
      [ { "code": "MAD", "symbol": "$", "name": "US Dollar", "rate": 9.38 } ]
    );
    expect(costPrice?.toFixed(2)).toBe((100 * 9.38).toFixed(2));
 })

  it("converts the price with different arguments", async() => {
    const costPrice = await convertPrice(100, "MAD", "USD",
          [ { "code": "USD", "symbol": "$", "name": "US Dollar", "rate": 0.10 } ]
    );
    expect((costPrice)?.toFixed(2)).toBe((100 * 0.10).toFixed(2));
 })

it('tests conversion with multiple currencies', () => {
  const exchangeRates: { code: CurrencyCode, symbol: string, name: string, rate: number }[] = [
    { code: "USD", symbol: "$", name: "US Dollar",     rate: 1     },
    { code: "EUR", symbol: "€", name: "Euro",          rate: 0.93  },
    { code: "GBP", symbol: "£", name: "British Pound", rate: 0.79  },
    { code: "JPY", symbol: "¥", name: "Japanese Yen",  rate: 149.5 },
  ]

  const values: { bookingCurrency: CurrencyCode, userCurrency: CurrencyCode, rate: number, expectedPrice: number }[] = [
    { bookingCurrency: "EUR", userCurrency: "USD", rate: 1,     expectedPrice: 100    }, // 100 * 1
    { bookingCurrency: "EUR", userCurrency: "GBP", rate: 0.79,  expectedPrice: 79     }, // 100 * 0.79
    { bookingCurrency: "EUR", userCurrency: "JPY", rate: 149.5, expectedPrice: 14950  }, // 100 * 149.5
    { bookingCurrency: "USD", userCurrency: "EUR", rate: 0.93,  expectedPrice: 93     }, // 100 * 0.93
    { bookingCurrency: "GBP", userCurrency: "EUR", rate: 0.93,  expectedPrice: 93     }, // 100 * 0.93
    { bookingCurrency: "JPY", userCurrency: "USD", rate: 1,     expectedPrice: 100    }, // 100 * 1
    { bookingCurrency: "USD", userCurrency: "USD", rate: 1,     expectedPrice: 100    }, // same currency
    { bookingCurrency: "EUR", userCurrency: "EUR", rate: 0.93,  expectedPrice: 93     }, // same currency
  ]

  for (const { bookingCurrency, userCurrency, expectedPrice } of values) {
    const costPrice = convertPrice(100, bookingCurrency, userCurrency, exchangeRates)
    expect(costPrice).toBe(expectedPrice)
  }
})
 })


 