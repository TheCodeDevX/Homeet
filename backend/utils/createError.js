

 export const createError = (msg, status) => { 
   const error = new Error(msg)
   error.statusCode = status || 500;
   throw error;
  }