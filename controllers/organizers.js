const ErrorResponse = require("../utils/errorResponse");
const {organizersDb} = require("../config/pouchDb");
const uniqid = require('uniqid');
const { log } = require("console");
const { url } = require("inspector");
const fs = require('node:fs');

exports.getOrganizers = async (req, res, next) => {
  const { id } = req.query;

  console.log('getOrganizers', id);

  try {
    const clientList = await organizersDb.allDocs({
      include_docs: true,
      attachments: true,
      keys: id ? [id] : undefined
    }).then( result =>{

      res.status(200).json({
        success: true,
        data: filterDocuments(result.rows),
      });
    });
  } catch (error) {
    next(error);
  }
};

exports.addOrganizer = async (req, res, next) => {
  try {
    const newOrganizer = req.body;
    newOrganizer._id = uniqid();
    newOrganizer.dateInserted = new Date().toISOString();
    newOrganizer.dateModified = new Date().toISOString();
    const response = await organizersDb.put(newOrganizer);

    fs.writeFileSync('./db/log.txt', `${newOrganizer.name} (${newOrganizer.server}) created at ${newOrganizer.dateInserted} \n`, {flag: 'a'});
    res.status(200).json({
      success: true,
      data: response,
    });
  }
  catch (error) {
    next(error);
  }
}

exports.deleteOrganizer = async (req, res, next) => {
  try {
    const organizer = await organizersDb.get(req.query.id);
    await organizersDb.remove(organizer);
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
}

exports.addItem = async (req, res, next) => {
  try {
    const {organizerId , item, itemPosition} = req.body;
    const organizer = await organizersDb.get(organizerId);

    if(!organizer) {
      return next(new ErrorResponse(`Organizer not found with id of ${organizerId}`, 404));
    }

    item._id = uniqid();
    item.dateInserted = new Date().toISOString();
    item.dateModified = new Date().toISOString();

    organizer.items[itemPosition] = item;
    // log(item);
    const response = await organizersDb.put(organizer);
    fs.writeFileSync('./db/log.txt', `${item.name} added to ${organizer.server}`, {flag: 'a'});

    res.status(200).json({
      success: true,
      data: response,
    });
  }
  catch (error) {
    next(error);
  }
}

exports.updateItem = async (req, res, next) => {
  try {
    const {organizerId , item} = req.body;
    log('1',organizerId, item);

    const organizer = await organizersDb.get(organizerId);

    if(!organizer) {
      return next(new ErrorResponse(`Organizer not found with id of ${organizerId}`, 404));
    }

    item.dateModified = new Date().toISOString();

    //find item position
    const itemPosition = organizer.items.findIndex((element) => element._id === item._id);

    log(itemPosition);

    // organizer.items[itemPosition] = item;
    organizer.items[itemPosition] = {"empty": true};
    organizer.items[item.position] = item;
    // log(item);
    const response = await organizersDb.put(organizer);
    res.status(200).json({
      success: true,
      data: response,
    });
  }
  catch (error) {
    next(error);
  }
}

exports.deleteItem = async (req, res, next) => {
  try {
    const {organizerId , itemPosition} = req.body;

    const organizer = await organizersDb.get(organizerId);

    if(!organizer) {
      return next(new ErrorResponse(`Organizer not found with id of ${organizerId}`, 404));
    }

    organizer.items.splice(itemPosition, 1);

    const response = await organizersDb.put(organizer);
    res.status(200).json({
      success: true,
      data: response,
    });
  }
  catch (error) {
    next(error);
  }
}

exports.findLocation = async (req, res, next) => {

  const {organizerId, index} = req.body;

  try{

    const organizer = await organizersDb.get(organizerId);

    console.log(organizer.items[index]);
    const item = organizer.items[index];
    const quantity = item.empty ? 0 : item.quantity;


    const url = `http://${organizer.server}.local/json`;
    await resetOrganizer(url);
    const red = "ff0000";
    const green = "00ff00";
    const yellow = "ffff00";
    let color = red;

    if (quantity >= 10) color = green;
    if (quantity > 0 && quantity < 10) color = yellow;

    console.log(`Fetching ${url}, with body: { on: true, bri: 255, seg: { id: 0, i: [${index}, ${color}] } }`);

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ on: true, bri: 255, seg: { id: 0, i: [index, color] } }),
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });

    res.status(200).json({
      success: true,
      data: {success: true, message: "Location found"},
    });

  }catch(error){
    next(error);
  }

};

const resetOrganizer = async (url) => {
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ on: true, bri: 255, seg: { id: 0, i: [0, 64, "000000"] } }),
  });
};

const filterDocuments = (documents) => {
  return documents.map((document) => {
    return document.doc;
  });
};