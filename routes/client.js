const express = require("express");
const router = express.Router();

const { getClientList, searchClientsByName, insertClient, getRecentClients, deleteClient, updateClient, resetDefault } = require("../controllers/client");

router.route("/").get(getClientList);

router.route("/search").get(searchClientsByName);

router.route("/recent").get(getRecentClients);

router.route("/new").post(insertClient);

router.route("/update").put(updateClient);

router.route("/reset").put(resetDefault);

router.route("/remove").delete(deleteClient);



module.exports = router;
