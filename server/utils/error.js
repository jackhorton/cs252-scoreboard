function ErrorCode(code, message, original) {
    this.code = code;
    this.message = message;
    this.name = 'ErrorCode';
    this.original = original;
    Error.captureStackTrace(this, ErrorCode);
}

ErrorCode.prototype = Object.create(Error.prototype);
ErrorCode.prototype.constructor = ErrorCode;

export default ErrorCode;
