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
  const existingPosts = await Post.find({ topic, type: "post" });
  let posts = [];
  for (let i = 0; i < existingPosts.length; i++) {
    await existingPosts[i].getUpvotesAndDownvotes();
    posts.push(existingPosts[i]);
  }
  res.status(StatusCodes.OK).json({ length: posts.length, posts });
};

const getAllQuestionsUnderATopic = async (req, res) => {
  const { topic } = req.body;
  const existingPosts = await Post.find({ type: "question", topic });
  let posts = [];
  for (let i = 0; i < existingPosts.length; i++) {
    await existingPosts[i].getUpvotesAndDownvotes();
    posts.push(existingPosts[i]);
  }
   res.status(StatusCodes.OK).json({ length: posts.length, posts });
};
const getAllResourcesUnderATopic = async (req, res) => {
  const { topic } = req.body;
  const existingPosts = await Post.find({
    type: { $in: ["link", "file"] },
    topic,
  });
  let posts = [];
  for (let i = 0; i < existingPosts.length; i++) {
    await existingPosts[i].getUpvotesAndDownvotes();
    posts.push(existingPosts[i]);
  }
  res.status(StatusCodes.OK).json({ length: posts.length, posts });
};

const getAllcontributorsUnderATopic = async (req, res) => {
  const { topic } = req.body;
  const posts = await Post.find({topic})
  const contributors = posts.map((x) => x.createdBy.toString());
  const contributorsObject = {};
  for (let i = 0; i < contributors.length; i++) {
   
    if (contributorsObject[contributors[i]])
      contributorsObject[contributors[i]] += 1;
    else contributorsObject[contributors[i]] = 1;
  }
  const uniqueContributors = Object.keys(contributorsObject);
  let userDetails = [];
  for (let i = 0; i < uniqueContributors.length; i++){
      const user = await User.findOne({ _id: uniqueContributors[i] })
    userDetails[i] = {
        username: user.username,
        name: `${user.firstName} ${user.lastName}`,
        profilePic: user.img,
        contributions: contributorsObject[uniqueContributors[i]]
      };
    };
  res.status(StatusCodes.OK).json(userDetails);
};

module.exports = {
  getAllTopics,
  getAllPostsUnderATopic,
  getAllQuestionsUnderATopic,
  getAllResourcesUnderATopic,
  getAllcontributorsUnderATopic,
};
