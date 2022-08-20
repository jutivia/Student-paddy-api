const Community = require("../models/community");
const { StatusCodes } = require("http-status-codes");
const Post = require("../models/post");
const User = require("../models/user");
const Topic = require("../models/topic");
const {
  NotVerified,
  UserNotFound,
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
} = require("../errors");


const getAllTopics = async (req, res) => {
    const topics = await Topic.find({})
    res.status(StatusCodes.OK).json({ length: topics.length, topics });
}

const getAllPostsUnderATopic = async (req, res) => {
    const {topic} = req.body
  const posts = await Post.find({ topic, type: 'post'  })
  res.status(StatusCodes.OK).json({ length: posts.length, posts });
};

const getAllQuestionsUnderATopic = async (req, res) => {
  const { topic } = req.body;
  const posts = await Post.find({ type: "question" , topic});
   res.status(StatusCodes.OK).json({ length: posts.length, posts });
};


const getAllcontributorsUnderATopic = async (req, res) => {
  const { topic } = req.body;
  const posts = await Post.find({topic})
  const contributors = posts.map((x) => x.createdBy);
  const contributorsObject = {};
  for (let i = 0; i < contributors.length; i++) {
    if (contributorsObject[contributors[i]])
      contributorsObject[contributors[i]] += 1;
    else contributorsObject[contributors[i]] = 1;
  }
  const uniqueContributors = Object.keys(contributorsObject);
  const userDetails = [];
  uniqueContributors.map(async (userId) => {
    const user = await User.find({ _id: userId }).select(username, img, _id);
    user.contributions = contributorsObject[userId];
    userDetails.push(user);
  });
  res.status(StatusCodes.OK).json(userDetails);
};

module.exports = {
  getAllTopics,
  getAllPostsUnderATopic,
  getAllQuestionsUnderATopic,
  getAllcontributorsUnderATopic,
};
