class CustomError extends Error {
  constructor(status, message,errors = null) {
    super(message); // Call parent constructor
    this.name = this.constructor.name; // Set the error name
    this.status = status || 500; // Optional custom property
    this.errors = errors;
    Object.setPrototypeOf(this, CustomError.prototype); // Capture stack trace
  }
}

export default CustomError;
