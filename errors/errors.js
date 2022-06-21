class RequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;

  }
}

class RegistrationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = {
  RequestError,
  AuthorizationError,
  NotFoundError,
  RegistrationError,
};
