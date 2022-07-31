import HttpException from "./HttpException";

class UnauthorizedExeption extends HttpException {
  constructor() {
    super(401, `Unauthorized`);
  }
}

export default UnauthorizedExeption;
