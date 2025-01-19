import HttpStatus from "../enums/httpStatus.js";

function admin(req, res, next) {
  if (!req.user.isAdmin)
    return res.status(HttpStatus.FORBIDDEN).json({message : "Access denied!"});
  next();
}

export default admin;
