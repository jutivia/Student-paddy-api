const { StatusCodes } = require("http-status-codes");
const Community = require("../models/community");
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
  const { userId } = req.params;
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
    const oneCommunity = await Community.findOne({ _id: community });
    if (!oneCommunity) throw new NotFoundError("Community not found");
    const followers = oneCommunity.followers + 1;
    await Community.findOneAndUpdate(
      { _id: community },
      { followers },
      {
        new: true,
        runValidators: true,
      }
    );
  });
  const updatedUser = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  });
    if (!updatedUser) throw new NotFoundError("User not found");
      res
        .status(StatusCodes.CREATED)
        .json({ updatedUser, msg: "user details filled successfully" });
};

const followCommunity = async (req, res) => {
  const { userId, communityId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) throw new NotFoundError("User not found");
  const isFollowing = user.communitiesFollowed.includes(communityId);
  if (!isFollowing) {
       const community = await Community.findOne({ _id: communityId });
       if (!community) throw new NotFoundError("Community not found");
       const followers = community.followers + 1;
       await Community.findOneAndUpdate(
         { _id: communityId },
         { followers },
         {
           new: true,
           runValidators: true,
         }
       );
    const newUserCommunity = [...user.communitiesFollowed, communityId];
    await User.findOneAndUpdate(
      { _id: userId },
      { communitiesFollowed: newUserCommunity },
      {
        new: true,
        runValidators: true,
      }
    );
  } else throw new BadRequestError("community followed already");
 
  res
    .status(StatusCodes.OK)
    .json({ msg: "community followed successfully" });
};

const unfollowCommunity = async (req, res) => {
  const { userId, communityId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) throw new NotFoundError("User not found");
  const isFollowing = user.communitiesFollowed.includes(communityId);
  if (isFollowing) {
    const community = await Community.findOne({ _id: communityId });
    if (!community) throw new NotFoundError("Community not found");
    const followers = community.followers - 1;
    await Community.findOneAndUpdate(
      { _id: communityId },
      { followers },
      {
        new: true,
        runValidators: true,
      }
    );
    const newUserCommunity = user.communitiesFollowed.filter(
      (x) => x !== communityId
    );
    await User.findOneAndUpdate(
      { _id: userId },
      { communitiesFollowed: newUserCommunity },
      {
        new: true,
        runValidators: true,
      }
    );
  } else throw new BadRequestError("community not followed already");

  res.status(StatusCodes.OK).json({ msg: "community unfollowed successfully" });
};

module.exports = { fillUserDetails, followCommunity, unfollowCommunity };
