const { StatusCodes } = require('http-status-codes')

const errorHandler = (err,req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || ' Something went wrong, Please try again later'
    }
    if (err.name === "ValidationError") customError.statusCode = StatusCodes.BAD_REQUEST
    
    if (err.name === "CastError") customError.statusCode = StatusCodes.BAD_REQUEST;
    
      return res.status(customError.statusCode).json({ msg: customError.msg });
}

module.exports = errorHandler;