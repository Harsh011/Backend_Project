const asyncHandler = (requestHandlers) => {
  (req, res, next) => {
    Promise.resolve(requestHandlers(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;

// this is try catch method

// const asyncHandler = (fn) => (req, res, next) => {
//   try {
//     await fn(req, res, next)
//   } catch (err) {
//     res.status(err.code || 500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
