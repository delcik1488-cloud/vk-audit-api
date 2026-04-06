function errorMiddleware(error, req, res, next) {
  const status = error.status || 500;

  res.status(status).json({
    success: false,
    error: {
      message: error.message || 'Internal Server Error',
    },
  });
}

module.exports = errorMiddleware;
