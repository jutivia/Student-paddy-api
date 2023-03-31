const express = require("express");
const router = express.Router();

const {
  getSingleUser,
  getAllusers,
} = require("../controllers/userActions");

router.get("/single", getSingleUser);
router.get("/allusers", getAllusers);

module.exports = router;
