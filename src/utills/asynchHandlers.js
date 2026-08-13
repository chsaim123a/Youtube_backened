const asyncHandlers = (requestHandlers) => {
    return async (req, res, next) => {
        Promise.resolve(requestHandlers(req, res, next)).catch((err) => next(err))
    }
}

export {asyncHandlers}