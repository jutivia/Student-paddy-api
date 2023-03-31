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

const catchAsync = require('../utils/asynAwait')


const userSignUp = catchAsync(async (req,res,next)=> {
    req.body.verified = false
    const user = await User.create({...req.body, type: 'user'})
    await user.sendMail()
    res.status(StatusCodes.CREATED).json({ msg: 'Verfifcation email sent'});
})

const verifyUserEmail = catchAsync(async (req, res, next) => {
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
        const token = user.createJWT()
            res
              .status(StatusCodes.ACCEPTED)
              .json({token, id: userId, msg: "user logged in successfully."});
      } catch (error) {
        throw new NotVerified("Email not verified");
      }
})
const userLogin = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email )
      throw new BadRequestError("provide an email");
    if (!password)
        throw new BadRequestError("Provide a  password")
  const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError("Invalid Credentials")
    }
    if (user.type !== 'user') {
      throw new BadRequestError("User is not a customer")
    }
    const verify = await bcrypt.compare(password, user.password);
    if (!verify) throw new BadRequestError("Email-Password mismatch");
    const approved = user.verified;
    if (!approved) throw new NotVerified("Email not verified");
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({token, id: user._id, msg: "user logged in successfully."})
});


const resetUserPassword = catchAsync(async (req, res, next) => {
  const query = {}
  if (req.body.email) {
    query.email = req.body.email
  } else if (req.body.username) {
    query.username = req.body.username
  }
  if (!req.body.email && !req.body.username) {
    throw new BadRequestError("Pass a username or password");
  }
  const user = await User.findOne(query)
  if (!user){
    throw new UnauthenticatedError("Invalid Credentials")
  }
  await user.sendResetPasswordToken()
  await user.save()
  res.status(StatusCodes.CREATED).json({msg: "Reset password token sent successfully"})
})

const confirmResetPassword = catchAsync(async(req,res,next) => {
  const {token, password, confirmPassword, email} = req.body
  const user = await User.findOne({email})
  if (!user){
    throw new UnauthenticatedError("Invalid Credentials")
  }
  try {
    const verify = await bcrypt.compare(
      token,
      user.passwordResetToken
    );
    if (!verify) throw new NotVerified("Wrong verification");
    await User.findOneAndUpdate({
      email
    }, { password, confirmPassword }, { new: true, runValidators: true });
    const token = user.createJWT()
        res
          .status(StatusCodes.ACCEPTED)
          .json({token, msg: "user password reset successfully"});
  } catch (error) {
    throw new NotVerified("Password not reset");
  }

})







module.exports = { userSignUp, userLogin, verifyUserEmail, resetUserPassword, confirmResetPassword };