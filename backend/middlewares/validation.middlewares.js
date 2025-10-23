import {matchedData, validationResult} from 'express-validator'


 export const handleValidation = (req, res, next) => {
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