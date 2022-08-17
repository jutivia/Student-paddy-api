
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

const auth =  (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Not Authorized')
    }
    const token = authorization.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: payload.userId, address: payload.address };
        next();
    } catch (error) {
        throw new UnauthenticatedError("Authentication invalid");
    }
    
}

module.exports = auth