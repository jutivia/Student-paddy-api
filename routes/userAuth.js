const express = require('express');
const router = express.Router()

const {
    userSignUp, userLogin, verifyUserEmail, resetUserPassword, confirmResetPassword 
} = require("../controllers/userAuth");

router.post('/signup', userSignUp)
router.post("/login", userLogin);
router.get("/verify/:userId/:uniqueString", verifyUserEmail);
router.get("/reset-password", resetUserPassword);
router.patch("/reset-password/:userId/:uniqueString", confirmResetPassword);

module.exports = router