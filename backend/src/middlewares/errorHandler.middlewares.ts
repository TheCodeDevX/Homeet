import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/createError";
import mongoose from "mongoose";
import { ErrorType } from "../shared/types/types";
 export const errorHandler = (err:AppError, req:Request, res:Response , next:NextFunction) => {
    
    const error : ErrorType = {
        
        message : err?.message || "Internal Server Error",
        name : err?.name || 'Unknown Error',
        stack : err?.stack,
        code : err?.code,
        statusCode : err?.statusCode || 500,
        type : err?.type || 'ServerError'

    }
    
    try {
    if(err.name === "CastError") {
        error.message = 'resource not found'
        error.statusCode = 404;
        error.type = 'CastError'
    }

    else if(err.name === "ValidationError") {
        if(err instanceof mongoose.Error.ValidationError) {
        error.message = Object.values(err.errors ?? {}).map(value => value.message).join(", ");
        error.statusCode = 400;
        error.type = "ValidationError"
        }
    
    }

    else if(err.code === 11000) {
        error.message = 'duplicated field value entered';
        error.statusCode = 409;
        error.type = "DuplicateKey"   
    }

    else if(err instanceof SyntaxError && error.statusCode === 400 && 'body' in err) {
        error.message = 'there was a problem with the data you sent'
        error.statusCode = 400;
        error.type = 'BadJson'
    }

    else if(err.name === 'JsonWebTokenError') {
        error.message = 'invalid token';
        error.statusCode = 401;
        error.type = 'JsonWebTokenError'
    }

    else if(err.name === 'TokenExpiredError') {
        error.message = 'expired token';
        error.statusCode = 401;
        error.type = 'TokenExpiredError'
    }

     else if(err.name === 'DocumentNotFoundError') {
        error.message = 'document not found';
        error.statusCode = 404;
        error.type = 'DocumentNotFoundError'
    }
    res.status(err.statusCode)
    .json({
            success : false, 
            message : error.message,
            type : error.type,
            stack : process.env.NODE_ENV === 'development' ? err.stack : null
        })   
    } catch (err) {
        console.error(error);
        res.status(error.statusCode).json({
            message : error.message,
            type : error.type,
        })
    }
 }