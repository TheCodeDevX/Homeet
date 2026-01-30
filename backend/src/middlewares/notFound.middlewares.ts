import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/createError";


 export const notFound = (req: Request, res:Response, next: NextFunction) => {
    const error = new AppError(`404 Not Found: ${req.originalUrl}`, 404);
    error.statusCode = 404;
    next(error);
 }