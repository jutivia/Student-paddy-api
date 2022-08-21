const Comment = require('../models/comment')
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
} = require("../errors")

const createComment = async (req, res) => {
    const { postId } = req.params
    const { content } = req.body
    if (!content) throw BadRequestError("Kindly provide a comment content")
    const user = await User.findOne({ _id: req.user.userId });
    await Comment.create({
      postId,
      hasParent: false,
      comment: content,
      UserDetails: {
        fullname: `${user.firstName} ${user.lastName}`,
        username: user.username,
        university: user.university,
        profilePic: user.img,
        userId: user._id,
      },
      childrenComents: 0
    });
    res.status(StatusCodes.Created).json({msg: 'comment created successfully'})
}

const createSubComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  if (!content) throw BadRequestError("Kindly provide a comment content");
  const user = await User.findOne({ _id: req.user.userId });
  await Comment.create({
    postId,
    hasParent: true,
    comment: content,
    parentId: commentId,
    childrenComents: 0,
    UserDetails: {
      fullname: `${user.firstName} ${user.lastName}`,
      username: user.username,
      university: user.university,
      profilePic: user.img,
      userId: user._id,
    },
  })
  await Comment.findOneAndUpdate(
    { parentId: commentId },
    { childrenComents: childrenComents + 1 },
    {
      new: true,
      runValidators: true,
    }
  );
  res
       .status(StatusCodes.Created)
       .json({ msg: "comment created successfully" });
};

const getMainComments = (req, res) => {
    const {postId} = req.params
    const comments = Comment.find({ postId })
    res
      .status(StatusCodes.OK)
      .json({ length: comments.length, comments});
}
const getSubComments = (req, res) => {
    const { postId, commentId } = req.params;
    const comments = Comment.find({ postId, parentId: commentId });
    res.status(StatusCodes.OK).json({ length: comments.length, comments });
};
module.exports = {
  createComment,
  createSubComment,
  getMainComments,
  getSubComments,
};