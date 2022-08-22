const FollowUser = require('../models/user-following')
const User = require('../models/user')
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require('../errors')

const followUser = async (req, res) => {
    const { followingId } = req.params;
    const follow = await FollowUser.findOne({
      userId: req.user.userId,
      followingId,
    });
    if (!follow) {
        const user = await User.findOne({ _id: followingId });
        if (!user) throw new NotFoundError(" Followee not found ")
        const fullName = `${user.firstName} ${user.lastName}`
        await FollowUser.create({
          userId: req.user.userId,
          followingId,
          nameOfFollowed: fullName,
          profilePic: user.img,
        });
        res.status(StatusCodes.OK).json({msg: 'user followed successfully'})
    } else throw new BadRequestError("User followed already")
}

const unFollowUser = async (req, res) => {
    const { followingId } = req.params;
    const follow = await FollowUser.findOne({
      userId: req.user.userId,
      followingId,
    });
    if (follow) {
      await FollowUser.findOneAndDelete({
        userId: req.user.userId,
        followingId,
      });
      res.status(StatusCodes.OK).json({ msg: "user unfollowed successfully" });
    } else throw new BadRequestError("User unfollowed already");
}

const getAllFollowersForUser = async (req, res) => {
    const followers = await FollowUser.find({ followingId: req.user.userId })
    res.status(StatusCodes.OK).json({ length: followers.length, followers })
}
const getAllFollowingsForUser = async (req, res) => {
  const followings = await FollowUser.find({ userId: req.user.userId })
  res.status(StatusCodes.OK).json({ length: followings.length,  followings })
};
module.exports = {
  followUser,
  unFollowUser,
  getAllFollowersForUser,
  getAllFollowingsForUser,
};