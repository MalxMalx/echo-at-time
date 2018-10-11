module.exports = class BadRequestError extends Error {
  constructor(errorData) {
    super();
    this.httpStatusCode = 400;
    this.data = errorData;
  }
};
