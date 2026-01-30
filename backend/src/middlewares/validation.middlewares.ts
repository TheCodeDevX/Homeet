import { NextFunction, Response, Request } from 'express';
import {matchedData, validationResult} from 'express-validator'


 export const handleValidation = (req:Request, res:Response, next:NextFunction) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json({errors : errors.array()})
            req.body = matchedData(req, {locations: ['body']})
            req.params = matchedData(req, {locations: ['params']})
            next();
    } catch (error) {
        console.error("error in handleValidation middleware")
        next(error);
    }
 }