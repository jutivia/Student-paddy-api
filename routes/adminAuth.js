const express = require('express');
const router = express.Router()

const {
  superAdminSignUp, adminLogin, verifyAdminEmail, adminSignUp, resetAdminPassword, confirmResetPassword
} = require("../controllers/adminAuth");

router.post('/super-admin/signup', superAdminSignUp)
router.post('/signup', adminSignUp)
router.post("/login", adminLogin);
router.get("/verify/:userId/:uniqueString", verifyAdminEmail);
router.get("/reset-password", resetAdminPassword);
router.patch("/reset-password/:userId/:uniqueString", confirmResetPassword);

module.exports = router