const express = require("express");
const router = express.Router();

// const { getClientList, searchClientsByName, insertClient, getRecentClients, deleteClient, updateClient, resetDefault } = require("../controllers/client");
const {getOrganizers, addOrganizer, deleteOrganizer, addItem, updateItem} = require ("../controllers/organizers");
// GET all organizers
router.route("/").get(getOrganizers);

// GET all items
// GET search items by name

// POST new organizer
router.route("/add").post(addOrganizer);

// POST new item
router.route("/additem").post(addItem);

// PUT update organizer
// PUT update item
router.route("/updateitem").put(updateItem);

// DELETE organizer
router.route("/delete").delete(deleteOrganizer);
// DELETE item

module.exports = router;
