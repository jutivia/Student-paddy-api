const PostSchema = require('../models/post')
const TopicSchema = require("../models/topic");
const { StatusCodes } = require("http-status-codes");
const {
  NotVerified,
  UserNotFound,
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
} = require("../errors");

const createPost = async (req, res) => {
    const {userId} = req.params
    const { topic, type, content, file, community } = req.body;
    if (type === 'file' ) {
        if (!file) throw new BadRequestError("Kindly input a file")
        req.body.content = null
    } else {
        if (!content) throw new BadRequestError("Kindly input the content of the post");
        req.body.file = null;
    }
    const existingTopic = await TopicSchema.findOne({ name: topic })
    if (!existingTopic) {
        await TopicSchema.create({ name: topic, contributions: 1, community })
    } else {
        const contributions = existingTopic.contributions + 1
        await TopicSchema.findOneAndUpdate(
          { name: topic },
          { contributions },
          {
            new: true,
            runValidators: true,
          }
        );
    }
    req.body.createdBy = userId;
    const post = await PostSchema.create(req.body)
    res.status(StatusCodes.CREATED).json({post, msg: 'Post created succesfully'});

}
const getAllPosts = async (req, res) => {
    const posts = await PostSchema.find({})
    res.status(StatusCodes.OK).json({length: posts.length, posts, msg: 'Posts retrieved succesfully'});
}

const getSinglePost = async (req, res) => { 
    const { postId } = req.params
    const post = await PostSchema.findOne({ _id: postId });
    if (!post) throw new NotFoundError("Post not found")
    res.status(StatusCodes.OK).json({post, msg: 'Post retrieved succesfully'});
};

const getAllResources = async (req, res) => {
  const posts = await PostSchema.find({
    type: { $in: ["link", "file"] }
  });
  res
    .status(StatusCodes.OK)
    .json({ length: posts.length, posts, msg: "Resources retrieved succesfully" });
};

const getAllQuestions = async (req, res) => {
  const posts = await PostSchema.find({
    type: 'question',
  });
  res
    .status(StatusCodes.OK)
    .json({
      length: posts.length,
      posts,
      msg: "Resources retrieved succesfully",
    });
};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  const post = await PostSchema.findOneAndDelete({ _id: postId });
  if (!post) throw new NotFoundError("Post not found");
  res.status(StatusCodes.OK).json({ msg: "Post deleted succesfully" });
};

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
  getAllResources,
  getAllQuestions,
};