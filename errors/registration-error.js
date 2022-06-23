module.exports = class RegistrationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
