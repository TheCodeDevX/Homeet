
 export const errorHandler = (err, req, res , next) => {
    
    const error = {
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
        error.message = Object.values(err.errors).map(value => value.message).join(", ");
        error.statusCode = 400;
        error.type = "ValidationError"
    }

    else if(err.code === 11000) {
        error.message = 'duplicated field value entered';
        error.statusCode = 409;
        error.type = "DuplicateKey"   
    }

    else if(err instanceof SyntaxError && err.statusCode === 400 && 'body' in err) {
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
        error.staus = 401;
        error.type = 'TokenExpiredError'
    }

     else if(err.name === 'DocumentNotFoundError') {
        error.message = 'document not found';
        error.staus = 404;
        error.type = 'DocumentNotFoundError'
    }
    res.status(err.statusCode || 500)
    .json({
            success : false, 
            message : error.message,
            type : error.type,
            stack : process.env.NODE_ENV === 'development' ? err.stack : null
        })   
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message : error.message,
            type : error.type,
        })
    }
 }