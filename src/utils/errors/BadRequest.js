import { CustomError } from "./CustomError.js";

export class BAD_REQUEST extends CustomError {
    constructor(message) {
      super(message);
      this.status = 400;
    }
}