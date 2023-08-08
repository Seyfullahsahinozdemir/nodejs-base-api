const Enum = require("../config/Enum");
const CustomError = require("./Error");

class Response {
  constructor() {}

  static successResponse(data, code = 200) {
    return {
      code,
      data,
    };
  }

  static errorResponse(error) {
    console.log(error);
    if (error instanceof CustomError) {
      return {
        code: error.code,
        error: {
          message: error.message,
          description: error.description,
        },
      };
    } else if (
      error.original?.errno != undefined &&
      error.original?.errno == 1062
    ) {
      return {
        code: Enum.HTTP_CODES.CONFLICT,
        error: {
          message: "Already exist an entry with this name",
          description: "Already exist an entry with this name",
        },
      };
    }

    return {
      code: Enum.HTTP_CODES.INT_SERVER_ERROR,
      error: {
        message: "Unknown Error",
        description: error.message,
      },
    };
  }
}

module.exports = Response;
