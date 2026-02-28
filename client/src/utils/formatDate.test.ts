import {describe, it, expect, beforeEach, vi, afterEach} from "vitest"
import "@testing-library/jest-dom/vitest"
import { formatDate } from "./formatDate";


  describe("formatDate", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    })

    afterEach(() => {
        vi.restoreAllMocks(); // restore the real system clock
    })

    it("converts string date to twelve-hour-format date", () => {
      const dateString = "2026-01-01T01:30:00Z" // since MongoDB returns ISO strings in ZULU time (UTC)
     const result = formatDate(dateString)
     expect(result).toMatch(/\d{2}:\d{2} (AM|PM)/) // We test the format not the timezone result
     //  which varies from one user's system clock to another's.
    })

    it("rejects invalid dates", () => {
      const result = formatDate('')
      expect(result).toBeNull()
    })
  })