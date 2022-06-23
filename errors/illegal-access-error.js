module.exports = class IllegalAccess extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
};
