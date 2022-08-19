const User = require('../models/user')
const { StatusCodes } = require("http-status-codes");

const signUp = async (req, res) => {
    req.body.verified = false
    const user = await User.create(req.body)
    await user.sendMail()
    res.status(StatusCodes.CREATED).json({user, msg: 'Verfifcation email sent'});
}

const login = (req, res) => {};








module.exports = {signUp, login}