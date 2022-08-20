const { StatusCodes } = require("http-status-codes");
const CommunitySchema = require("../models/community");
const User = require("../models/user");

const { NotFoundError, BadRequestError } = require("../errors");

const fillUserDetails = async (req, res) => {
  const {
    firstName,
    lastName,
    academicStatus,
    higherInstitution,
    skillSet,
    faculty,
    department,
    expectedYearOfGraduation,
    yearOfGraduation,
    communitiesFollowed,
  } = req.body;
  const { id } = req.params;
  if (!firstName && !lastName)
    throw new BadRequestError("Kindly enter your first and last names");
  if (!academicStatus)
    throw new BadRequestError("Kindly select your academic status");
  if (!higherInstitution)
    throw new BadRequestError("Kindly select a higher institution");
  if (!faculty && !department)
    throw new BadRequestError("Kindly enter your faculty and department");
  if (academicStatus === "undergraduate") {
    if (expectedYearOfGraduation < 2022)
      throw new BadRequestError(
        "Expected year of graduation should be from 2022"
      );
  } else {
    if (yearOfGraduation > 2022)
      throw new BadRequestError("Year of graduation should be 2022 0r before");
  }
  communitiesFollowed.map(async (community) => {
    const oneCommunity = await CommunitySchema.findOne({ _id: community.id });
    if (!oneCommunity) throw new NotFoundError("Community not found");
    const followers = oneCommunity.followers + 1;
    await CommunitySchema.findOneAndUpdate(
      { _id: community.id },
      { followers },
      {
        new: true,
        runValidators: true,
      }
    );
  });
  const updatedUser = await User.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
    if (!updatedUser) throw new NotFoundError("User not found");
      res
        .status(StatusCodes.CREATED)
        .json({ updatedUser, msg: "user details filled successfully" });
};

module.exports = { fillUserDetails };
