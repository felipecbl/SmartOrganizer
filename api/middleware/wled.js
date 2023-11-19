const { log } = require("console");
const rgbHex = require('rgb-hex'); // Lib to translate rgb to hex
const hexRgb = require('hex-rgb'); // Lib to translate hex to rgb
const WebSocket = require('ws'); // Lib to handle Websocket
const {default: axios} = require('axios'); // Lib to handle http requests
const bonjour = require('bonjour')(); // load Bonjour library

exports.devices = {};
this.effects = {};
this.palettes = {};
this.createdStatesDetails = {};

exports.scanDevices = async () => {
  try {
    // Browse and listen for WLED devices
    const browser = await bonjour.find({
      'type': 'wled'
    });
    log('Bonjour service started, new  devices  will  be detected automatically');

    // Event listener if new devices are detected
    browser.on('up', (data) => {
      const id = data.txt.mac;
      const ip = data.referer.address;
log(data)

      // Check if device is already know
      if (this.devices[ip] == null) {
        log('New WLED  device found ' + data.name + ' on IP ' + data.referer.address);

        //  Add device to array
        this.devices[ip] = {};
        this.devices[ip].mac = id;
        this.devices[ip].ip = ip;
        this.devices[ip].name = data.name;

        log('Devices array from bonjour scan : ' + JSON.stringify(this.devices));
        this.devices[ip].connected = false;
        // Initialize device
        this.getDeviceJSON(ip);
      } else {
        // Update ip information in case of change
        this.devices[ip].ip = ip;
      }
      // log('Devices array from bonjour scan : ' + JSON.stringify(this.devices));
    });
  } catch (error) {
    // this.errorHandler(`[scanDevices]`, error);
    log(error);
  }
}

exports.getDeviceJSON = async(deviceIP) => {
  try {
    log(`getDeviceJSON called for : ${deviceIP}`);

    try {

      const requestDeviceDataByAPI = async () => {
        const response = await axios.get(`http://${deviceIP}/json`, {timeout: 3000}); // Timout of 3 seconds for API call
        log(JSON.stringify('API response data : ' + response.data));
        const deviceData = response.data;
        return deviceData;
      };

      // Check if connection is handled by websocket before proceeding
      if (this.devices[deviceIP]
        && (this.devices[deviceIP].connected && this.devices[deviceIP].wsConnected && this.devices[deviceIP].wsPingSupported)) {
        // Nothing to do, device is connected by websocket and will handle state updates
      } else { // No Websocket connection, handle data by http_API

        const deviceData = await requestDeviceDataByAPI();

        // If device is initialised, only handle state updates otherwise complete initialisation
        if (this.devices[deviceIP]
          && (this.devices[deviceIP].connected && this.devices[deviceIP].initialized)){

          if (!deviceData) {
            log(`Heartbeat of device ${deviceIP} failed, will try to reconnect`);
            this.devices[deviceIP].connected = false;
            this.devices[deviceIP].initialized = false;
            this.devices[deviceIP].wsConnected = false;
            await this.create_state(this.devices[deviceIP].mac + '._info' + '._online', 'Online status', false);
            return 'failed';
          } else {
            log(`Heartbeat of device ${deviceIP} successfully`);
            if (this.devices[deviceIP].connected && this.devices[deviceIP].wsConnected) {
              // Only reset heartbeat, device is connected by websocket and will handle state updates
              this.setStateChanged(this.devices[deviceIP].mac + '._info' + '._online', {val: true, ack: true});
              return 'success';
            } else {
              await this.handleStates(deviceData, deviceIP);
              this.devices[deviceIP].wsConnected = false;
              this.setStateChanged(this.devices[deviceIP].mac + '._info' + '._online', {val: true, ack: true});
              return 'success';
            }
          }

        } else {

          if (!deviceData) {
            log(`Unable to initialise ${deviceIP} will retry in scheduled interval !`);
            this.devices[deviceIP].initialized = false;
            // Update device working state
            if (this.devices[deviceIP].mac != null) {
              await this.create_state(this.devices[deviceIP].mac + '._info' + '._online', 'Online status', {val: false, ack: true});
            }
            return 'failed';
          } else {
            log('Info Data received from WLED device ' + JSON.stringify(deviceData));
            log(`Initialising : " ${deviceData.info.name}" on IP :  ${deviceIP}`);
            await this.handleBasicStates(deviceIP, deviceData);
            return 'success';
          }
        }

      }

    } catch (error) {

      if (this.devices[deviceIP] && this.devices[deviceIP].connected){
        log(`Device ${deviceIP} offline, will try to reconnect`);
        if (this.devices[deviceIP].mac != null) {
          await this.create_state(this.devices[deviceIP].mac + '._info' + '._online', 'Online status', false);
          // Set Device status to off and brightness to 0 if devices disconnects
          this.setState(`${this.devices[deviceIP].mac}.on`, {val: false, ack: true});
          this.setState(`${this.devices[deviceIP].mac}.bri`, {val: 0, ack: true});
        }
        this.devices[deviceIP].connected = false;
        this.devices[deviceIP].wsConnected = false;
        this.devices[deviceIP].initialized = false;
        try {
          ws[deviceIP].close();
        } catch (e) {
          console.error(e);
        }
      }
      return 'failed';
    }
  } catch (error) {
    this.errorHandler(`[getDeviceJSON]`, error);
  }
}