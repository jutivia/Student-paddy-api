const express = require('express');
const router = express.Router()

const {
  signUp,
  login,
  verifyEmail,
} = require("../controllers/auth");
router.post('/signup', signUp)
router.post("/login", login);
router.get("/user/verify/:id/:uniqueString", verifyEmail);

module.exports = router