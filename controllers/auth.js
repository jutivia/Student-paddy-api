const User = require('../models/user')
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const UserVerification = require('../models/userVerification')
const {
  NotVerified,
  UserNotFound,
  UnauthenticatedError,
  BadRequestError,
} = require("../errors")
const signUp = async (req, res) => {
    req.body.verified = false
    const user = await User.create(req.body)
    await user.sendMail()
    res.status(StatusCodes.CREATED).json({ msg: 'Verfifcation email sent'});
}

const verifyEmail = async (req, res) => {
  const { userId, uniqueString } = req.params;
    const userVerification = await UserVerification.findOne({ userId });
    if (!userVerification) throw new UserNotFound();
    const seconds = Math.floor(userVerification.expiresAt.getTime());
    if (Date.now() > seconds)
      return res
        .status(StatusCodes.REQUEST_TIMEOUT)
        .json({ msg: "Email verficication expired" });
      try {
        const verify = await bcrypt.compare(
          uniqueString,
          userVerification.uniqueString
        );
        if (!verify) throw new NotVerified("Wrong verification");
        const user = await User.findOneAndUpdate({
          _id: userId,
        }, { verified: true }, { new: true, runValidators: true });
        if (!user) throw new UserNotFound();
            res
              .status(StatusCodes.ACCEPTED)
              .json("Email verfified successfully");
      } catch (error) {
        throw new NotVerified("Email not verified");
      }
}
const login = async (req, res) => {
    const { email, password } = req.body
    if (!email )
      throw new BadRequestError("provide an email ");
    if (!password)
        throw new BadRequestError("Provide a  password")
  const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError("Invalid Credentials")
    }
    const verify = await bcrypt.compare(password, user.password);
    if (!verify) throw new BadRequestError("Email-Password mismatch");
    const approved = user.verified;
    if (!approved) throw new NotVerified("Email not verified");
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({token, id: user._id, msg: "user logged in successfully."})
};








module.exports = { signUp, login, verifyEmail };