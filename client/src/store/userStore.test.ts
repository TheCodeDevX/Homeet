import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

  vi.mock("../lib/axios.config", () => {
     return {
         UserApi : {
             post : vi.fn(),
             put : vi.fn(),
             get : vi.fn()
         }
     };
  });

import "@testing-library/jest-dom/vitest"
import {  type AxiosInstance } from "axios";
import { type Mock, type MockedFunctionDeep } from "@vitest/spy";
import { act, renderHook } from "@testing-library/react";
import { UserApi } from "../lib/axios.config";
import * as helpers from "./helpers/errorHelper";
import type { ErrorHandlerParameters } from "../types/types";
import { useUserStore } from "./userStore";


describe("userStore", () => {
    let mockAxios : MockedFunctionDeep<AxiosInstance>
    let spy :Mock<({ error, defaultErr }: ErrorHandlerParameters) => string>
    beforeEach(() => {
     useUserStore.setState({
       user: null,
       isUserLoading:false,
       error:null
    });
    mockAxios = vi.mocked(UserApi, true);
     spy = vi.spyOn(helpers, 'errorHandler').mockImplementation(({error, defaultErr}) => {
            return (error as Error)?.message || defaultErr
    })
   

});

afterEach(() => {
     vi.resetAllMocks()
     spy.mockRestore()
});

    it("fetches user data by id", async () => {
       mockAxios.get.mockResolvedValueOnce({data : { _id : "123", email : "user@gmail.com"}});
       const {result} = renderHook(() => useUserStore());

       await act(async () => {
        await result.current.getUser("123")
       });

        expect(result.current.user).toEqual({_id : '123', email : 'user@gmail.com'});
        expect(result.current.isUserLoading).toBe(false);
        expect(result.current.error).toBeNull()
    })

    
    it("sets an error message returned by errHandler", async () => {

        const Err = new Error("something went wrong")
        mockAxios.get.mockRejectedValueOnce(Err)
        const {result} = renderHook(() => useUserStore())
        await act(async() => {
        try {
        await result.current.getUser('123')
        } catch (error) {
        expect(error).toBe(Err)
        }
        });

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : 'FETCH_USER_ERROR'})
        expect(result.current.error).toBe("something went wrong")
        expect(result.current.user).toBeNull()

    })

     it("sets a default error message when the original error message is not found", async () => {
        
        const Err = new Error(undefined)
        mockAxios.get.mockRejectedValueOnce(Err)
        const {result} = renderHook(() => useUserStore())
        await act( async() => {
        try {
        await result.current.getUser("123")
        } catch (error) {
        expect(error).toBe(Err)
        }
        });
        console.log(Err?.message)

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({error : Err, defaultErr : 'FETCH_USER_ERROR'})
        expect(result.current.error).toBe("FETCH_USER_ERROR")
        expect(result.current.user).toBeNull()

    })
})