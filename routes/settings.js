const express = require("express");
const router = express.Router();

const { getSettings, updateSettings, getDevices } = require("../controllers/settings");

router.route("/").get(getSettings);
router.route("/devices").get(getDevices);
router.route("/").put(updateSettings);

module.exports = router;
