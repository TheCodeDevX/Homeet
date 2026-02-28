import {describe, it, expect, beforeEach, vi, afterEach} from "vitest"
import "@testing-library/jest-dom/vitest"
import { formatTime } from "./formatTime";

 describe("formatTime", () => {

    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-02-05T08:30:00.9985Z")) 
    })
    afterEach(() => vi.restoreAllMocks())

    it("rejects invalid dates", () => {
        const inputValues = ['', '09', '12', '2035-0-1111', '2025-01-20T12:00:0.23Z', '00']
        inputValues.forEach((input) => {
        const result = formatTime(input)
        expect(result.msg).toBe('invalid date')
        })
    })
    
    
    it("handles future timestamps", () => {
        const result = formatTime('2026-02-05T09:30:01Z')
        expect(result.msg).toBe('invalid date')
    })
    

    it("returns 'fresh' if the timestamp is less than 1ms old", () => {
        const result = formatTime('2026-02-05T08:30:00.9980Z')
        expect(result.msg).toBe('fresh')
    })


    it('returns time in milliseconds if the timestamp is less than 1 second old', () => {
        const result = formatTime('2026-02-05T08:29:59.999Z')
        expect(result.msg).toBe('time in ms')
    })


    it('returns time in seconds for timestamps 1-59s old', () => {
        const result = formatTime('2026-02-05T08:29:50Z')
        expect(result.msg).toBe('time in seconds')
    })

    
    it('returns time in minutes for timestamps 1-59min old', () => {
        const result = formatTime('2026-02-05T08:01:50Z')
        expect(result.msg).toBe('time in minutes')
    })


    it('returns time in hours if the timestamp is at least 1h old and less than 24h old', () => {
        const inputValues = ['2026-02-05T07:30:00.9980Z', '2026-02-04T09:30:00.998Z'] // 1h , 23h old
        inputValues.forEach((input) => {
        const result = formatTime(input)
        expect(result.msg).toBe('time in hours')
        })
        
    })


    it('returns time in days if the timestamp is at least 1d old and less than 30d old', () => {        
        const inputValues = ['2026-02-04T08:30:00.9985Z', '2026-01-07T08:30:00.9985Z'] //1d, 29d
        inputValues.forEach((input) => {
        const result = formatTime(input)
        expect(result.msg).toBe('time in days')
        })
        
    })

     
    it('returns time in months if the timestamp is at least 30d old and less than 12mo old', () => {
        const inputValues = ['2026-01-06T08:30:00.9985Z', '2025-03-05T08:30:00.9985Z'] // 1mo, 11mo
        inputValues.forEach((input) => {
        const result = formatTime(input)
        expect(result.msg).toBe('time in months')
        })
        
    })


    it('returns time in years if the timestamp is at least 12mo old', () => {
        const result = formatTime('2025-02-05T08:30:00.9985Z') // 1y old
        expect(result.msg).toBe('time in years')    
    })


 })