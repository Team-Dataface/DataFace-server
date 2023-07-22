const ERROR_PATTERNS = {
  NOT_AUTHORIZED: {
    status: 401,
    message: "Unauthorized",
    messageForUser: "엑세스 권한이 없습니다 :(",
  },
  PAGE_NOT_FOUND: {
    status: 404,
    message: "Page Is Not Found",
    messageForUser: "요청하신 페이지는 존재하지 않습니다 :(",
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: "Internal Server Error",
    messageForUser: "서버오류가 발생하였습니다 :(",
  },
  BAD_REQUEST: {
    status: 400,
    message: "Bad Request",
    messageForUser: "잘못된 요청입니다 :(",
  },
};

module.exports = ERROR_PATTERNS;
