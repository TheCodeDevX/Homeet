

 export const notFound = (req, res, next) => {
    const error = new Error(`404 Not Found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
 }