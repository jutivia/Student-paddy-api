const mongoose = require('mongoose')
const { countries } = require('../utils/countries')
const {universities} = require('../utils/universities')
const crpt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserVerification = require('../models/userVerification')
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const { StatusCodes } = require("http-status-codes");


const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      reuired: [true, "kindly enter a valid email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
      unique: true,
    },
    username: {
      type: String,
      required: [true, "Kindly enter a username"],
      unique: true,
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Kindly enter a country"],
      enum: countries,
    },
    password: {
      type: String,
      required: [true, "Kindly enter a password"],
      minlength: 7,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    academicStatus: {
      type: String,
      enums: ["undergraduate", "graduate", "postgraduate"],
    },
    higherInstitution: {
      type: String,
      enums: universities.map((x) => x.name),
    },
    skillSet: {
      type: [String],
    },
    faculty: {
      type: String,
    },
    department: {
      type: String,
    },
    expectedYearOfGraduation: {
      type: Number,
    },
    yearOfGraduation: {
      type: Number,
    },
    communitiesFollowed: [
      {
        id: mongoose.Types.ObjectId,
        name: String,
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
    const salt = await crpt.genSalt(10)
    this.password = await crpt.hash(this.password, salt);
})

UserSchema.methods.createJWT = function () {
    return jwt.sign({
        userId: this._id, name: this.name
    }, process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME
        }
    )
}

UserSchema.methods.sendMail = async function () {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_APP_PASS,
      },
    });
    const currentUrl = `https://localhost:${process.env.PORT}/api/v1/auth`
    const uniqueString = uuidv4() + this._id

    let mailOptions = {
      from: process.env.AUTH_Email,
      to: this.email,
      Subject: "Verify Your Email",
      html: `<p> Verify your email address to complete the sign up process and login into your account</p> <p>This link <b> expires in 6hours </b> </p> <p> Press <a href=${currentUrl + '/user/verify/' + this._id + '/' +uniqueString}> here to proceed </a> </p>`,
    };

    const salt = await crpt.genSalt(10)
    const hash = await crpt.hash(uniqueString, salt)
    const userVerification = await UserVerification.create({
        userId: this._id,
        uniqueString: hash,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000
    })
    if (!userVerification) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Couldn't save verification email details");
    transporter
      .sendMail(mailOptions)
      .catch((err) =>
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json("Mail sending Failed")
      );
};

module.exports = mongoose.model('User', UserSchema);