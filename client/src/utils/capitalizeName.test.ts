
 import {describe, it, expect, beforeEach, vi, afterEach} from "vitest"
import "@testing-library/jest-dom/vitest"
import { sliceText } from "./sliceText";
import { capitalizedName } from "./capitalizeName";


  describe("capitalizeName", () => {
    it("capitalizes the first letter", () => {
       const name = "john";
       const result = capitalizedName(name)
       expect(result).toBe("John") 
    })

    it("handles already first-capitalized letter", () => {
        const name = "John"
       const result = capitalizedName(name)
       expect(result).toBe("John")
    })

    it('handles all uppercase', () => {
        const name = 'JOHN'
        const result = capitalizedName(name);
        expect(result).toBe('John');
    })

    it("handles mixed case", () => {
     const name = 'JoHn'
     const result = capitalizedName(name)
     expect(result).toBe('John')
    })

    it("handles edge cases with empty string", () => {
        const result = capitalizedName("")
        expect(result).toBe('');
    })

  })