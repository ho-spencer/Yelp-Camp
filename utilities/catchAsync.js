/*
    Async Error catch/wrapper function

    - wrapper function accepts a function (func)
    - returns a new function, that has "func" executed
        - catches any errors, and passes it to next() (the error handler)
*/
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}