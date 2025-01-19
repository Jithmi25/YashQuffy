import User from "../models/user.js";
import userRepository from "../repositories/userRepository.js";
import HttpStatus from "../enums/httpStatus.js";

const user = new User(null, null, null, null, null, null);

const getUser = async (req, res) => {
  const id = req.params.id;
  user.id = id;
  const validateErrMsg = user.validateId();
  if (validateErrMsg)
    return res.status(HttpStatus.BAD_REQUEST).send(validateErrMsg);
  try {
    const result = await userRepository.getUserById(id);
    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
    } 
    return res.status(HttpStatus.OK).json({ data: result });
    
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error ocurred" });
  }
};

export default {
  getUser,
};
