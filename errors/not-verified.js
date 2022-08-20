const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class NotVerified extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.ValidationError;
  }
}
class UserNotFound extends CustomAPIError {
  constructor() {
    super('User Not Found');
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = { NotVerified, UserNotFound };
