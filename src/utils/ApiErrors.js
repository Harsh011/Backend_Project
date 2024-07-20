class ApiError extends Error {
  constructor(
    statusCode,
    message = "Somthing went wrong",
    errrors = [],
    statck = ""
  ) {
    super(message),
      (this.statusCode = statusCode),
      (this.message = message),
      (this.data = null),
      (this.success = false),
      (this.errrors = errrors);

    if (statck) {
      this.statck = statck;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
