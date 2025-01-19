import jwt from "jsonwebtoken";
import HttpStatus from "../enums/httpStatus.js";

function auth(req, res, next) {
  let token = req.header("Authorization");
  
  if (!token)
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .send("Access denied! No token provided");

  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length).trimLeft();
  }


  try {
    const decode = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = decode.user;
    
    next();
  } catch (ex) {
    res.status(HttpStatus.BAD_REQUEST).send("Invalid token");
  }
}

export default auth;
