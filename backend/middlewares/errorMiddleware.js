const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errorHandler = (err, req, res, next) => {
    const errorStatusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(errorStatusCode);
    res.json({
        message: err.message,
        stack: err.stack
    })
}

export { notFound, errorHandler }