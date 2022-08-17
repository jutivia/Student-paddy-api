const notFound = (req, res, next) => {
    return res.status(404).json({msg: 'Route Does Not Exist'})
}

module.exports = notFound;