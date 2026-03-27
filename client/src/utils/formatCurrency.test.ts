import {describe, it, expect} from "vitest"
import "@testing-library/jest-dom/vitest"
import { formatCurrency } from "./formatCurrency"
import type { CurrencyCode } from "../types/types"

describe('convertPrice', () => {
it("formats currency", () => {
  const values: Partial<Record<CurrencyCode, { input: number, expected: string }[]>> = {
    USD: [
      { input: 100,           expected: "$100.00"  },
      { input: 1_000,         expected: "$1.0K"    },
      { input: 1_500_000,     expected: "$1.5M"    },
      { input: 2_000_000_000, expected: "$2.0B"    },
    ],
    EUR: [
      { input: 100,           expected: "€100.00"  },
      { input: 1_000,         expected: "€1.0K"    },
    ],
    GBP: [
      { input: 100,           expected: "£100.00"  },
      { input: 1_000,         expected: "£1.0K"    },
    ],
    JPY: [
      { input: 100,           expected: "¥100.00"     }, 
      { input: 1_000,         expected: "¥1.0K"    },
    ],
    CAD: [
      { input: 100,           expected: "$100.00"  },
      { input: 1_000,         expected: "$1.0K"    },
    ],
    AUD: [
      { input: 100,           expected: "$100.00"  },
      { input: 1_000,         expected: "$1.0K"    },
    ],
    CHF: [
      { input: 100,           expected: "CHF100.00"},
      { input: 1_000,         expected: "CHF1.0K"  },
    ],
    CNY: [
      { input: 100,           expected: "¥100.00"  },
      { input: 1_000,         expected: "¥1.0K"    },
    ],
    SAR: [
      { input: 100,           expected: "100.00 SAR" }, // suffix
      { input: 1_000,         expected: "1.0K SAR"   },
    ],
    AED: [
      { input: 100,           expected: "100.00 AED" }, // suffix
      { input: 1_000,         expected: "1.0K AED"   },
    ],
    EGP: [
      { input: 100,           expected: "100.00 EGP" }, // suffix
      { input: 1_000,         expected: "1.0K EGP"   },
    ],
    MAD: [
      { input: 100,           expected: "100.00 MAD" }, // suffix
      { input: 1_000,         expected: "1.0K MAD"   },
    ],
    BRL: [
      { input: 100,           expected: "R$100.00"  },
      { input: 1_000,         expected: "R$1.0K"    },
    ],
    INR: [
      { input: 100,           expected: "₹100.00"  },
      { input: 1_000,         expected: "₹1.0K"    },
    ],
    TRY: [
      { input: 100,           expected: "₺100.00"  },
      { input: 1_000,         expected: "₺1.0K"    },
    ],
    ZAR: [
      { input: 100,           expected: "R100.00"  },
      { input: 1_000,         expected: "R1.0K"    },
    ],
    SGD: [
      { input: 100,           expected: "$100.00"  },
      { input: 1_000,         expected: "$1.0K"    },
    ],
    HKD: [
      { input: 100,           expected: "$100.00"  },
      { input: 1_000,         expected: "$1.0K"    },
    ],
  }

  for (const [currency, cases] of Object.entries(values) as [CurrencyCode, { input: number, expected: string }[]][]) {
    for (const { input, expected } of cases) {
      expect(formatCurrency(input, currency)).toBe(expected)
    }
  }
})

 })


 