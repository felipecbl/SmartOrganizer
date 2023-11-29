const ErrorResponse = require("../utils/errorResponse");
const {organizersDb} = require("../config/pouchDb");
const uniqid = require('uniqid');
const { log } = require("console");

exports.getOrganizers = async (req, res, next) => {
  const { id } = req.query;

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
    log(organizerId, item);

    const organizer = await organizersDb.get(organizerId);

    if(!organizer) {
      return next(new ErrorResponse(`Organizer not found with id of ${organizerId}`, 404));
    }

    item.dateModified = new Date().toISOString();

    //find item position
    const itemPosition = organizer.items.findIndex((element) => element._id === item._id);

    log(itemPosition);

    organizer.items[itemPosition] = item;
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

const filterDocuments = (documents) => {
  return documents.map((document) => {
    return document.doc;
  });
};