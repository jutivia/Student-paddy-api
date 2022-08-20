const express = require("express");
const router = express.Router();

const { fillUserDetails } = require("../controllers/UpdateUser");
router.post("/:id", fillUserDetails);


module.exports = router;
