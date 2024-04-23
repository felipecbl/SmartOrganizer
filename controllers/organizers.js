const ErrorResponse = require("../utils/errorResponse");
const {organizersDb} = require("../config/pouchDb");
const {settingsDb} = require("../config/pouchDb");
const {defaultSettings, resetToDefaultSettings} = require("./settings");
const uniqid = require('uniqid');
const { log } = require("console");
const { url } = require("inspector");
const fs = require('node:fs');
const { set } = require("mongoose");
let timeoutId;
let currentState;

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

    // fs.writeFileSync('./db/log.txt', `${newOrganizer.name} (${newOrganizer.server}) created at ${newOrganizer.dateInserted} \n`, {flag: 'a'});
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
    const response = await organizersDb.put(organizer);
    // fs.writeFileSync('./db/log.txt', `${item.name} added to ${organizer.server}`, {flag: 'a'});

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
    const organizer = await organizersDb.get(organizerId);

    if(!organizer) {
      return next(new ErrorResponse(`Organizer not found with id of ${organizerId}`, 404));
    }

    item.dateModified = new Date().toISOString();

    //find item position
    const itemPosition = organizer.items.findIndex((element) => element._id === item._id);

    organizer.items[itemPosition] = {"empty": true};
    organizer.items[item.position] = item;
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
  const {organizerId, index, blink} = req.body;

  // const blink = false;

  try{
    const organizer = await organizersDb.get(organizerId);
    const item = organizer.items[index];

    log(organizer);

    const quantity = item.empty ? 0 : item.quantity;
    // try ip first, then server
    const url = `http://${organizer.ip??organizer.server + '.local'}/json`;
    clearTimeout(timeoutId);

    let settings = await settingsDb.allDocs({
      include_docs: true,
      attachments: true,
      keys: ['settings']
    });

    if(settings.total_rows === 0) {
      // return next(new ErrorResponse(`Settings not found`, 404));

      log('Settings not found, resetting to default...');
      settings  = await resetToDefaultSettings();
      log('Settings set to default values!');
    }else{
      settings = settings.rows[0].doc;
    }

    const colorLow = settings.colors.low;
    const colorMedium = settings.colors.medium;
    const colorHigh = settings.colors.high;
    const timeout = settings.timeout;
    const thresholdLow = settings.thresholds.low;
    const thresholdHigh = settings.thresholds.high;
    let color = colorLow;

    if (quantity >= thresholdHigh) color = colorHigh;
    if (quantity > thresholdLow && quantity < thresholdHigh) color = colorMedium;

    const coordX = index % organizer.columns;
    const coordY = Math.floor(index / organizer.columns);

    const data = {
      on:true,
      bri:255,
      transition:7,
      mainseg:0,
      seg:[
        resetData(organizer.rows, organizer.columns),
        {
          id: 0,
          start:  coordX,
          stop:  coordX+1,
          startY: coordY,
          stopY: coordY+1,
          grp: 1,
          spc: 0,
          of: 0,
          on: true,
          frz: false,
          bri: 255,
          cct: 127,
          set: 0,
          n: "",
          col: blink ? [colorLow, colorHigh, "000000"] : [color],
          fx: blink? 2 : 0,
          sx: 255,
          ix: 128,
          pal: 0,
          c1: 128,
          c2: 128,
          c3: 16,
          sel: true,
          rev: false,
          mi: false,
          rY: false,
          mY: false,
          tp: false,
          o1: false,
          o2: false,
          o3: false,
          si: 0,
          m12: 0}
        ]
      }
    // const data = blink ? {
    //   on: true,
    //   bri: 255,
    //   seg: {
    //       id:0,
    //       start:index,
    //       len:1,
    //       on:true,
    //       bri:255,
    //       cct:127,
    //       col:[colorLow, colorHigh, "000000"],
    //       fx:2,
    //       sx:255,
    //       ix:255,
    //       pal:2
    //     }
    // } :{
    //   on: true,
    //   bri: 255,
    //   seg: {
    //     id: 0,
    //     i: [index, color],
    //   },
    // };

// get current state only if timeoutId is not set or destroyed
    if(!timeoutId || (timeoutId && timeoutId._destroyed)){
      const stateUrl = `${url}/state`;
      console.log(`Fetching current state of ${stateUrl}`);
      currentState = await fetch(stateUrl)
        .then(response => {
          // Check if the request was successful
          if (response.ok) {
            // Parse JSON response
            return response.json();
          }
          // If the request failed, throw an error
          throw new Error('Failed to retrieve status');
        })
        .then(status => {
          // Process the status information
          return status;
        })
        .catch(error => {
          console.error(error);
        });
    }

    // await resetOrganizer(url);

    console.log(`Fetching ${url}, with body: ${JSON.stringify(data)}`);
  fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    .then((response) => {
      log(`Organizer ${organizer.name} will reset in ${timeout}ms.`);
      timeoutId = setTimeout(async () => {
        log(`Resetting ${organizer.name}...`);
        // await resetOrganizer(url);
        await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentState),
        });
        log(`${organizer.name} reset successfully!`);
      }, timeout);

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

const resetData = (rows, columns) => {
  return {
      id: 0,
      start: 0,
      stop: columns,
      startY: 0,
      stopY: rows,
      fx: -1,
      i: [0,columns*rows -1, "000000"],
      col: ["000000", "000000", "000000"]
    };
  }

// const resetOrganizer = async (url) => {
//   const data = {
//     id: 0,
//     fx: 0,
//     start: 0,
//     stop: 999,
//     on: true,
//     col: ["000000", "000000", "000000"],
//     i:[0, 999, "000000"]
//   };
//   log(`Resetting ${url}...`);
//   return await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });
// };

const filterDocuments = (documents) => {
  return documents.map((document) => {
    return document.doc;
  });
};