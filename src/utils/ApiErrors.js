class ApiError extends Error {
  constructor(
    statusCode,
    message = "Somthing went wrong",
    errrors = [],
    stack = ""
  ) {
    super(message),
      (this.statusCode = statusCode),
      (this.message = message),
      (this.data = null),
      (this.success = false),
      (this.errrors = errrors);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
