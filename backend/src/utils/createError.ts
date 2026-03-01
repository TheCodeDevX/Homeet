import type mongoose from "mongoose";

 export class AppError extends Error {
  statusCode: number;
  code : number | undefined;
  type : string | undefined;
  errors: undefined | mongoose.Error.ValidationError

  constructor(message:string, statusCode : number, code?: number, type?: string, errors?: mongoose.Error.ValidationError ) {
   super(message);
   this.statusCode = statusCode;
   this.code = code;
   this.type = type;
   this.errors = errors;
   Object.setPrototypeOf(this, AppError.prototype)
  }
 }

 export const createError = (msg: string, status : number) => { 
  const error = new AppError(msg, status);
   error.statusCode = status || 500;
   throw error;
  }