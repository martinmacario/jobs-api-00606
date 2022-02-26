const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);
  // return res.status(200).json(err);
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong try again later 1.'
  }
  // if (err instanceof CustomAPIError ) {
  //   console.log('is custom api error...')
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if (err.name === 'CastError') {
    customError.msg = `Not item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND
  }
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(', ');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicated value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
