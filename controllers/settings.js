const ErrorResponse = require("../utils/errorResponse");
const {settingsDb} = require("../config/pouchDb");
const { scanDevices, devices } = require("../middleware/wled");
const { log, time } = require("console");
const { set } = require("mongoose");

const defaultSettings = {
  colors: {
    low: 'ff0000',
    medium: 'ffff00',
    high: '00ff00',
    empty: 'ffffff',
  },
  thresholds: {
    low: 0,
    high: 10,
  },
  // one minute in milliseconds
  timeout: 60000,
  name: 'settings',
  _id: 'settings',
}

exports.defaultSettings = defaultSettings;

const resetToDefaultSettings = async () => {
  try {
    await settingsDb.put(defaultSettings);
    return defaultSettings;
  } catch (error) {
    console.error('Error resetting settings', error);
  }
}

exports.resetToDefaultSettings = resetToDefaultSettings;

exports.resetSettings = async (req, res, next) => {
  try {

    const settings = await resetToDefaultSettings();

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await settingsDb.allDocs({
      include_docs: true,
      attachments: true,
      keys: ['settings']
    });

    if(settings.rows.length === 0) {
      const newSettings = {
        ...defaultSettings,
        name: 'settings',
        _id: 'settings',
      }
      await settingsDb.put(newSettings).then( result =>{
      res.status(200).json({
        success: true,
        data: newSettings
      });
    });
      return;
    }

    res.status(200).json({
      success: true,
      data: filterDocuments(settings.rows),

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
      ...defaultSettings,
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

exports.deleteSettings = async (req, res, next) => {
  try {
    const settings = await settingsDb.get('settings');
    await settingsDb.remove(settings);
    res.status(200).json({
      success: true,
      data: {},
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