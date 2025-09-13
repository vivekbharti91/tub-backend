const asyncHandler = (requestHandler) => {
    (req, res, next) =>{
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}
 

export default asyncHandler;
// This is a middleware to handle async functions in Express routes.
// It wraps an async function and ensures that any errors are passed to the next middleware (usually an error handler).





// const asyncHandler = (fn) => (req,res,next) => {
//     try {
//         fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }