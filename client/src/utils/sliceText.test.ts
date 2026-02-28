import {describe, it, expect, beforeEach, vi, afterEach} from "vitest"
import "@testing-library/jest-dom/vitest"
import { sliceText } from "./sliceText";


  describe("sliceText", () => {
   const defaultConfig = {
    splitAt:" ",
    joinAt:" ",
    start:0,
    end:5,
    extra:"..."
   }
    it("slices text whose length is above the threshold", () => {
    const text = "Lorem ipsum dolor sit amet consectetur adipiscing elit" 
    const result = sliceText({text, threshold: 5, ...defaultConfig})
    expect(result).toBe("Lorem ipsum dolor sit amet...")
    })

    it("returns the original text if it's below the threshold", () => {
    const text = "Lorem ipsum dolor sit amet consectetur adipiscing elit" 
    const result = sliceText({text, threshold: 20, ...defaultConfig})
    expect(result).toBe(text)
    })

    it("handles edge cases with empty text", () => {
     const text = ""; // TS ensures it's a string, so empty string is the only falsy value.
     const result = sliceText({text, threshold: 0, ...defaultConfig}) 
     expect(result).toBe("");
    })
  })