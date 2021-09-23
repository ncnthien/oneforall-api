// See more at https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

enum httpStatus {
  CONTINUE = 100,
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  MULTIPLE_CHOICE = 300,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  GATEWAY_TIMEOUT = 504,
}

export default httpStatus
