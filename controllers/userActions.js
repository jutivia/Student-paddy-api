const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");

const { NotFoundError, BadRequestError } = require("../errors");


const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId })
  if (!user) throw new NotFoundError("User not found")
  res.status(StatusCodes.OK).json({ user })
}
const getAllusers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ allUsers });
}
module.exports = {
  getSingleUser,
  getAllusers,
};
