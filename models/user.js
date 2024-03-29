const mongoose = require("mongoose");
const crpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserVerification = require("./userVerification");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const { StatusCodes } = require("http-status-codes");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      reuired: [true, "kindly enter a valid email"],
      lowerCase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Kindly enter a username"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Kindly enter a password"],
      validate: [
        validator.isStrongPassword,
        "Password must contain at least one uppercase letter, one lowercase letter and one number",
      ],
    },
    confirmPassword: {
      type: String,
      required: [true, "Kindly confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same",
      },
    },
    verified: false,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

UserSchema .pre("save", async function () {
  const salt = await crpt.genSalt(10);
  this.password = await crpt.hash(this.password, salt);
  this.confirmPassword = undefined
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.sendMail = async function () {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_APP_PASS,
    },
  });
  const currentUrl = `https://localhost:${process.env.PORT}/api/v1/auth`;
  const uniqueString = uuidv4() + this._id;
  let mailOptions = {
    from: process.env.AUTH_Email,
    to: this.email,
    Subject: "Verify Your Email",
    html: `<p> Verify your email address to complete the sign up process and login into your account</p> <p>This link <b> expires in 6hours </b> </p> <p> Press <a href=${
      currentUrl + "/user/verify/" + this._id + "/" + uniqueString
    }> here to proceed </a> </p>`,
  };

  const salt = await crpt.genSalt(10);
  const hash = await crpt.hash(uniqueString, salt);
  const userVerification = await UserVerification.create({
    userId: this._id,
    uniqueString: hash,
    createdAt: Date.now(),
    expiresAt: Date.now() + 21600000,
  });
  if (!userVerification)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json("Couldn't save verification email details");
  transporter
    .sendMail(mailOptions)
    .catch((err) =>
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Mail sending Failed")
    );
};

UserSchema.methods.sendResetPasswordToken = async function () {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_APP_PASS,
    },
  });
  const currentUrl = `https://localhost:${process.env.PORT}/api/v1/auth`;
  const uniqueString = uuidv4();
  let mailOptions = {
    from: process.env.AUTH_Email,
    to: this.email,
    Subject: "Reset Password",
    html: `<p> You've requested to reset your password</p> <p>Click the link below to reset your password </p> <p>This link <b> expires in 30 minutes </b> </p> <p> Press <a href=${
      currentUrl + "/reset-password/" + this._id + "/" + uniqueString
    }> to reset your password</p>`,
  };

  const salt = await crpt.genSalt(10);
  const hash = await crpt.hash(uniqueString, salt);
 this.passwordResetToken = hash
 this.passwordResetExpires =  Date.now() + 60*30
  transporter
    .sendMail(mailOptions)
    .catch((err) =>
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Mail sending Failed")
    );
};


module.exports = mongoose.model("User", UserSchema);
