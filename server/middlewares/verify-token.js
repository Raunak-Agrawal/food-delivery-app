import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../errors/not-authorized-error.js";

export const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    throw new NotAuthorizedError();
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === null) {
    throw new NotAuthorizedError();
  }
  let payload = jwt.verify(token, process.env.JWT_KEY);
  if (!payload) {
    throw new NotAuthorizedError();
  }
  req.userId = payload.id;
  next();
};
