const ErrorResponse = require("../utils/errorResponse");
const {clientDb} = require("../config/pouchDb");
const {defaultClientData, defaultClientId} = require("../models/defaultClient");
const defaultClientLanguages = require("../models/defaultClient/languages");
const uniqid = require('uniqid');


exports.getClientList = async (req, res, next) => {
  const { id } = req.query;

  try {
    const clientList = await clientDb.allDocs({
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

exports.resetDefault = async (req, res, next) => {
  try {
    const client = await clientDb.get(defaultClientId);
    await clientDb.remove(client);
    await clientDb.put(defaultClientData);

    res.status(200).json({
      success: true,
      data: defaultClientData,
    });
  } catch (error) {
    next(error);
  }
}

exports.insertClient = async (req, res, next) => {
  const { clientName, languages } = req.body;

  try {
    const newClientLanguages = languages.map((language) => {
      return defaultClientData.languages.find((lang) => lang.culture === language);
    });

    // create new client from default client
    const newClient = { ...defaultClientData };

    newClient.languages = newClientLanguages;
    newClient.name = clientName;
    newClient._id = uniqid();
    newClient.isDefault = false;
    newClient.dateInserted = new Date().toISOString();
    newClient.dateModified = new Date().toISOString();

    await clientDb.put(newClient);

    res.status(200).json({
      success: true,
      data: newClient,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.searchClientsByName = async (req, res, next) => {
  const { name } = req.query;

  try {
    const clientsObj = await clientDb.allDocs({ include_docs: true, attachments: true })
    const clients = clientsObj.rows.filter((client) => {
      return client.doc.name.toLowerCase().includes(name.toLowerCase())
    });

    res.status(200).json({
      success: true,
      data: filterDocuments(clients),
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecentClients = async (req, res, next) => {
  const { limit } = req.query;

  try {
    const clientsObj = (await clientDb.allDocs({include_docs: true, attachments: true}));
    const defaultClientObj = await clientDb.allDocs({key: defaultClientId, include_docs: true, attachments: true});
    const sortedClients = clientsObj.rows.sort((a, b) => {

      // dateModified or dateCreated?
      return new Date(b.doc.dateModified) - new Date(a.doc.dateModified);
    });


    const defaultClient = defaultClientObj.rows[0];
    const clients = [defaultClient,  ...new Set(sortedClients.slice(Math.max(sortedClients.length - limit??10, 0)))]

    //remove default client from list
    const uniqueClients = clients.filter((item, pos) =>{
      return item.id !== defaultClientId;
    });

    // and ensure only one default client is in the top of the list
    uniqueClients.unshift(defaultClient);


    res.status(200).json({
      success: true,
      data: filterDocuments(uniqueClients),
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteClient = async (req, res, next) => {
  const { id } = req.query;

  try {
    const client = await clientDb.get(id);
    await clientDb.remove(client);

    res.status(200).json({
      success: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateClient = async (req, res, next) => {
  const { id, clientName, languages } = req.body;

  try {
    const client = await clientDb.get(id);
    const existingClientLanguages = client.languages.map((language) => language.culture);
    const newClientLanguages = languages.map((language) => {
      if (existingClientLanguages.includes(language)) {
        return client.languages.find((lang) => lang.culture === language);
      }else{
        return defaultClientLanguages.find((lang) => lang.culture === language);
      }
    });

    const response = await clientDb.put({
      _id: id,
      _rev: client._rev,
      name: clientName,
      languages: newClientLanguages,
      isDefault: false,
      dateModified: new Date().toISOString(),
    });

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
}

// // update default client for any eventual changes
// exports.updateDefault = async (req, res, next) => {
//   console.log(defaultClientData);
//   try {
//     const client = await clientDb.get(defaultClientId);
//     const response = await clientDb.put({
//       _id: defaultClientId,
//       _rev: client._rev,
//       ...defaultClientData
//     });

//     res.status(200).json({
//       success: true,
//       data: client,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

const filterDocuments = (documents) => {
  return documents.map((document) => {
    return document.doc;
  });
};

