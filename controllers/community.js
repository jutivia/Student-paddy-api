const Community = require('../models/community')
const { StatusCodes } = require("http-status-codes");
const Post = require('../models/post')
const User = require("../models/user");
const Topic = require("../models/topic");
const {
  NotVerified,
  UserNotFound,
  UnauthenticatedError,
    BadRequestError,
  NotFoundError
} = require("../errors")

const createCommunity = async (req, res) => {
    const community = await Community.create(req.body)
    res
      .status(StatusCodes.CREATED)
      .json({ community, msg: "Community created successfully" });
}

const getAllCommunities = async (req, res) => {
    const communities = await Community.find({})
    res.status(StatusCodes.OK).json({ length: communities.length, communities });
}

const getAllPostsForEachCommunity = async (req, res) => {
  const { communityId } = req.params
  const posts = await Post.find({ type: 'post' });
  const postsByCommunity = posts.filter(post => {
    post.community.includes(communityId) === true
  })
  res
    .status(StatusCodes.OK)
    .json({ length: postsByCommunity.length, postsByCommunity });
}

const getAllQuestionsForEachCommunity = async (req, res) => {
  const { communityId } = req.params;
  const posts = await Post.find({ type: "question" });
  const postsByCommunity = posts.filter((post) => {
    post.community.includes(communityId) === true;
  });
  res
    .status(StatusCodes.OK)
    .json({ length: postsByCommunity.length, postsByCommunity });
};

const getAllResourcesForEachCommunity = async (req, res) => {
  const { communityId } = req.params;
  const posts = await Post.find({
    type: { $in: ["link", "file"] }
  });
  const postsByCommunity = posts.filter((post) => {
    post.community.includes(communityId) === true;
  });
  res
    .status(StatusCodes.OK)
    .json({ length: postsByCommunity.length, postsByCommunity });
};

const getAllTopicsByCommunityId = async (req, res) => {
  const { communityId } = req.params;
  const topics = await Topic.find({})
  const topicsByCommunity = topics.filter((topic) => {
    topic.community.includes(communityId) === true;
  });
  res
    .status(StatusCodes.OK)
    .json({ length: topicsByCommunity.length, topicsByCommunity });
}

const getAllcontributorsByCommunityId = async (req, res) => {
  const { communityId } = req.params;
  const posts = await Post.find({});
  const postsByCommunity = posts.filter((post) => {
    post.community.includes(communityId) === true;
  });
  const contributors = postsByCommunity.map((x) => x.createdBy);
  const contributorsObject = {}
  for (let i = 0; i < contributors.length; i++){
    if (contributorsObject[contributors[i]]) contributorsObject[contributors[i]]+= 1;
    else contributorsObject[contributors[i]] = 1
  }
  const uniqueContributors = Object.keys(contributorsObject);
  const userDetails = []
  uniqueContributors.map(async (userId) => {
    const user = await User.find({ _id: userId }).select(username, img, _id);
    user.contributions = contributorsObject[userId]
    userDetails.push(user)
  })
  res
    .status(StatusCodes.OK)
    .json(userDetails);
}

const getAllFollowersByCommunityId = async (req, res) => {
  const { communityId } = req.params;
  const users = await User.find({})
  const followers = users.filter((user) => user.communitiesFollowed.includes(communityId) === true)
  const allFollowers = []
  followers.map(async (follower) => {
    const posts = await Post.find({ createdBy: follower._id })
    posts = posts.filter((user) => user.communitiesFollowed.includes(communityId) === true)
    follower.contributions = posts.length
    allFollowers.push(follower);
  })
  res.status(StatusCodes.OK).json(allFollowers);
  
};
module.exports = {
  createCommunity,
  getAllCommunities,
  getAllPostsForEachCommunity,
  getAllQuestionsForEachCommunity,
  getAllResourcesForEachCommunity,
  getAllTopicsByCommunityId,
  getAllcontributorsByCommunityId,
  getAllFollowersByCommunityId,
};