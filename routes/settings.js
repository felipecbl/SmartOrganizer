const express = require("express");
const router = express.Router();

const { getSettings, updateSettings, getDevices, resetSettings, deleteSettings } = require("../controllers/settings");

router.route("/").get(getSettings);
router.route("/devices").get(getDevices);
router.route("/").put(updateSettings);
router.route("/reset").post(resetSettings);
router.route("/").delete(deleteSettings);

module.exports = router;
