const CommunitySchema = require('../models/community')
const { StatusCodes } = require("http-status-codes");
const {
  NotVerified,
  UserNotFound,
  UnauthenticatedError,
    BadRequestError,
  NotFoundError
} = require("../errors")

const createCommunity = async (req, res) => {
    const community = await CommunitySchema.create(req.body)
    res
      .status(StatusCodes.CREATED)
      .json({ community, msg: "Community created successfully" });
}

const getAllCommunities = async (req, res) => {
    const communities = await CommunitySchema.find({})
    res.status(StatusCodes.OK).json({ length: communities.length, communities });
}

const followCommunity = async (req, res) => {
    const {id} = req.params
    const community = await CommunitySchema.findOne({ _id: id })
    if (!community) throw new NotFoundError('Community not found');
    const followers = community.followers +1;
    const newCommunity = await CommunitySchema.findOneAndUpdate(
      { _id: id },
      { followers },
      {
        new: true,
        runValidators: true,
      }
    );
    res
      .status(StatusCodes.OK)
      .json({ msg: "community updated successfully", newCommunity });
}

const unFollowCommunity = async (req, res) => {
  const { id } = req.params;
  const community = await CommunitySchema.findOne({ _id: id });
  if (!community) throw new NotFoundError("Community not found");
  const followers = community.followers - 1;
  const newCommunity = await CommunitySchema.findOneAndUpdate(
    { _id: id },
    { followers },
    {
      new: true,
      runValidators: true,
    }
  );
  res
    .status(StatusCodes.OK)
    .json({ msg: "community updated successfully", newCommunity });
};

module.exports = {
  createCommunity,
  getAllCommunities,
  followCommunity,
  unFollowCommunity,
};