class ExpressError extends Error {
    constructor(statusCode, message){
        super();                // calls error constructor
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;