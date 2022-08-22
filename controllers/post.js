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
const Upvote = require("../models/upvote");
const Downvote = require("../models/downvote");
const Repost = require("../models/repost");

const createPost = async (req, res) => {
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
  req.body.createdBy = req.user.userId;
    const post = await PostSchema.create(req.body)
    res.status(StatusCodes.CREATED).json({post, msg: 'Post created succesfully'});

}
const getAllPosts = async (req, res) => {
  const existingPosts = await PostSchema.find({})
  let posts = []
  for (let i = 0; i < existingPosts.length; i++){
    await existingPosts[i].getUpvotesAndDownvotes();
    posts.push(existingPosts[i]);
  };
    res.status(StatusCodes.OK).json({
      length: posts.length,
      posts,
      msg: "Posts retrieved succesfully",
    });
}

const getSinglePost = async (req, res) => { 
    const { postId } = req.params
  const post = await PostSchema.findOne({ _id: postId });
  if (!post) throw new NotFoundError("Post not found")
  await post.getUpvotesAndDownvotes();
 
    res
      .status(StatusCodes.OK)
      .json({ post, msg: "Post retrieved succesfully" });
};

const getAllResources = async (req, res) => {
  const existingPosts = await PostSchema.find({
    type: { $in: ["link", "file"] },
  });
  let posts = [];
  for (let i = 0; i < existingPosts.length; i++) {
    await existingPosts[i].getUpvotesAndDownvotes();
    posts.push(existingPosts[i]);
  }
  res
    .status(StatusCodes.OK)
    .json({
      length: posts.length,
      posts,
      msg: "Resources retrieved succesfully",
    });
};;

const getAllQuestions = async (req, res) => {
  const existingPosts = await PostSchema.find({
    type: "question",
  });
   let posts = [];
   for (let i = 0; i < existingPosts.length; i++) {
     await existingPosts[i].getUpvotesAndDownvotes();
     posts.push(existingPosts[i]);
   }
  res.status(StatusCodes.OK)
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
  const topic = await TopicSchema.findOne({ name: post.topic })
  if (topic) await TopicSchema.findOneAndUpdate(
    { name: post.topic },
    { contributions: topic.contributions - 1 }
  );
  res.status(StatusCodes.OK).json({ msg: "Post deleted succesfully" });
};

const UpvoteAPost = async (req, res) => {
  const { postId } = req.params
  const upvoteExists = await Upvote.findOne({ userId: req.user.userId, postId });
  if (upvoteExists) throw new BadRequestError('Post upvoted by user already');
  Upvote.create({ userId: req.user.userId, postId });
  res.status(StatusCodes.OK).json({ msg: "Post upvote added succesfully" });
};

const RemoveUpvoteOnAPost = async (req, res) => {
  const { postId } = req.params;
  const upvoteExists = await Upvote.findOne({ userId: req.user.userId, postId });
  if (!upvoteExists) throw new BadRequestError("Post not upvoted by user already");
  await Upvote.findOneAndDelete({ userId: req.user.userId, postId });
  res.status(StatusCodes.OK).json({ msg: "Post upvote removed succesfully" });
};

const DownvoteAPost = async (req, res) => {
   const { postId } = req.params;
   const downvoteExists = await Downvote.findOne({ userId: req.user.userId, postId });
   if (downvoteExists)
     throw new BadRequestError("Post downvoted by user already");
   await Downvote.create({ userId: req.user.userId, postId });
   res
     .status(StatusCodes.OK)
     .json({ msg: "Post downvote added succesfully" });
};
const RemoveDownvoteOnAPost = async (req, res) => {
     const { postId } = req.params;
     const downvoteExists = await Downvote.findOne({
       userId: req.user.userId,
       postId,
     });
     if (!downvoteExists)
       throw new BadRequestError("Post not downvoted by user already");
     await Downvote.findOneAndDelete({ userId: req.user.userId, postId });
     res
       .status(StatusCodes.OK)
       .json({ msg: "Post downvote removed succesfully" });
};

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
  getAllResources,
  getAllQuestions,
  UpvoteAPost,
  RemoveUpvoteOnAPost,
  DownvoteAPost,
  RemoveDownvoteOnAPost,
};