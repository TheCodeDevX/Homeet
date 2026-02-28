import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest"
import { useBookingStore } from "./bookingStore";
import type { AxiosInstance } from "axios";
import { type MockedFunctionDeep } from "@vitest/spy";
import { BookingApi } from "../lib/axios.config";
import { act, renderHook } from "@testing-library/react";



vi.mock("../lib/axios.config", () => {
   return {
    BookingApi : {
        get : vi.fn(),
        put : vi.fn(),
        post : vi.fn()
    }
   }
});

 describe("useBookingStore", () => {
   let mockAxios : MockedFunctionDeep<AxiosInstance>
   beforeEach(() => {
      useBookingStore.setState({booking : null, isBookingLoading:false, error:null, message:""})
       mockAxios = vi.mocked(BookingApi,true)
   })
   afterEach(() => {
      vi.resetAllMocks();
   })
    it("creates a booking successfully!", async () => {
        mockAxios.post.mockResolvedValueOnce({data : {message : "Booking confirmed!",
          booking : {checkIn : "2026/12/01", adults : 2, costPrice : 100}}});
        const {result} = renderHook(() => useBookingStore());

        await act(async() => {
         await result.current.createBooking("mock-id", { adults : 2, children:1, checkIn : "2026/12/01"} as any);
        })

        expect(mockAxios.post).toHaveBeenCalled()
        expect(mockAxios.post).toHaveBeenCalledWith(`/book-property/mock-id`, { adults : 2, children:1, checkIn : "2026/12/01"} )

        expect(result.current.isBookingLoading).toBe(false)
        expect(result.current.error).toBe(null)
        expect(result.current.message).toBe("Booking confirmed!")
        expect(result.current.booking).toEqual({checkIn : "2026/12/01", adults : 2, costPrice : 100});
    });

     it('assigns a default error message when error.message is undefined', async() => {
            const error = new Error(undefined);
            mockAxios.post.mockRejectedValueOnce(error);
            const {result} = renderHook(() => useBookingStore());
    
            await act(async () => {
                try {
                await result.current.createBooking("123", { adults : 2, children:1, checkIn : "2026/12/01"} as any);
                } catch (e) {
                   expect(e).toEqual(error)
                }
            })
            expect(result.current.error).toBe('BOOKING_FAILED');
    });
 })

