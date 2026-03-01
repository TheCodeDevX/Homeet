import {describe, it, expect} from "vitest"
import "@testing-library/jest-dom/vitest"
import { getTimeInMilliseconds } from "./getTimeInMilliseconds"



 describe('getTime', () => {
 it("gets time from a date in milliseconds", () => {
    const time = getTimeInMilliseconds("2025-01-22T00:00:00Z")
    expect(time).toBe(1737504000000);
 })

 it("returns 0 when the date is undefined, empty, or invalid", () => {
   const invalidInputs = [undefined, '2025-09-0', '', 'invalid-string', '2025-13-01']
   invalidInputs.forEach((input) => {
   expect(getTimeInMilliseconds(input)).toBe(0);
   })
 })

 })