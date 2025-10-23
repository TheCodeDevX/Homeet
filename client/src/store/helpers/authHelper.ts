import { isAxiosError } from "axios";


export const handleAxiosError = (error : unknown) => {

    if(isAxiosError(error)) {
    return  error.response?.data?.message
    } else if (error instanceof Error) {
    return error?.message;
    
}
}


//  export const 