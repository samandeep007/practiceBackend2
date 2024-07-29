const asyncHandler = (apiHandler) => {
    return (req, res, next) => {
        Promise.resolve(apiHandler(req, res, next)).catch(error => next(error))
    }
}