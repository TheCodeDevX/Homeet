import { isAxiosError } from "axios";
import type { ErrorHandlerParameters } from "../../types/types";

/**
 * Extracts error message from various error types 
 * @param error - The error object (Error, AxiosError, or unknown) 
 * @param defaultErr - A default error message used as a fallback.
 * @returns - The error message string.
*/

export const errorHandler = ({error, defaultErr} : ErrorHandlerParameters) : string => {
    if(isAxiosError(error)) {
    return error?.response?.data?.message || error?.response?.data?.errors?.[0]?.msg || defaultErr;
    }
    if (error instanceof Error && error.message) return error.message;
    return defaultErr;
}



