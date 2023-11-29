const ErrorResponse = require("../utils/errorResponse");
const {settingsDb} = require("../config/pouchDb");
const { scanDevices, devices } = require("../middleware/wled");
const { log } = require("console");

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await settingsDb.get('settings');
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  const { settings } = req.body;


  try {
    const config = await settingsDb.get('settings');
    const newData = {
      ...config,
      ...settings,
      name: 'settings',
      _id: 'settings',
    }

    const updatedSettings = await settingsDb.put(newData);

    res.status(200).json({
      success: true,
      data: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
};

exports.getDevices = async (req, res, next) => {
  try {
    await scanDevices();
    log('devices scanned>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', devices);
    const devicesArray = Object.values(devices)
    res.status(200).json({
      success: true,
      data: devicesArray
    });

  } catch (error) {
    next(error);
  }
};


const filterDocuments = (documents) => {
  return documents.map((document) => {
    return document.doc;
  });
};