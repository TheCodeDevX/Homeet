import "@testing-library/jest-dom/vitest"
import { describe, expect, it } from "vitest"
import { errorHandler } from "./errorHelper"
import { AxiosError } from "axios"


describe("errorHelper", () => {
    it("returns a default when the API error message is undefined", () => {
        const error = new Error(undefined)
        const result = errorHandler({error, defaultErr : "Default Error"})
        expect(result).toBe("Default Error")
    })


      it("returns an error message when the server throws it", () => {
        const error = new Error("Email is undefined!")
        const result = errorHandler({error, defaultErr : "Default Error"})
        expect(result).toBe("Email is undefined!")
    })

     it("returns a default when the axios error message is undefined", () => {
        const error = new AxiosError(
        'Request failed with status code 400',
        'ERR_BAD_REQUEST',
        { headers: {} } as any, 
        {},
        {
        status: 400,
        statusText: 'Bad Request',
        data: { message: undefined },
        headers: {},
        config: { headers: {} } as any 
        }
        );
        const result = errorHandler({error, defaultErr : "Default Error"})
        expect(result).toBe("Default Error")
    })



     it("returns an error message when axios throws it", () => {
        const error = new AxiosError(
        'Request failed with status code 400',
        'ERR_BAD_REQUEST',
        { headers: {} } as any, 
        {},
        {
        status: 400,
        statusText: 'Bad Request',
        data: { message: 'Email not found!' },
        headers: {},
        config: { headers: {} } as any 
        }
        );
        const result = errorHandler({error, defaultErr : "Default Error"})
        expect(result).toBe("Email not found!")
    })

     it("returns a error message when a validation error occurs", () => {
        const error = new AxiosError(
        'Request failed with status code 400',
        'ERR_BAD_REQUEST',
        { headers: {} } as any, 
        {},
        {
        status: 400,
        statusText: 'Bad Request',
        data: { errors : [ { msg : 'Email is required' } ] },
        headers: {},
        config: { headers: {} } as any 
        }
        );
        const result = errorHandler({error, defaultErr : "Default Error"})
        expect(result).toBe("Email is required")
    })

    
     it("handles when errors array is undefined", () => {
        const error = new AxiosError(
        'Request failed with status code 400',
        'ERR_BAD_REQUEST',
        { headers: {} } as any, 
        {},
        {
        status: 400,
        statusText: 'Bad Request',
        data: { errors :  [] },
        headers: {},
        config: { headers: {} } as any 
        }
        );
        const result = errorHandler({error, defaultErr : "Default Error"})
        expect(result).toBe("Default Error")
    })


      it("handles when msg is empty", () => {
        const error = new AxiosError(
        'Request failed with status code 400',
        'ERR_BAD_REQUEST',
        { headers: {} } as any, 
        {},
        {
        status: 400,
        statusText: 'Bad Request',
        data: { errors :  [{msg : undefined}] },
        headers: {},
        config: { headers: {} } as any 
        }
        );
        const result = errorHandler({error, defaultErr : "Default Error"})
        expect(result).toBe("Default Error")
    })
})