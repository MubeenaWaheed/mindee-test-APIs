const mindee = require("mindee");
require("dotenv").config();
const { sendResponse } = require("./helpers");
const { MINDI_API_KEY } = process.env;
const { inspect } = require("util");

async function configureMindee(key, filePath, documentType) {
  try {
    const mindeeClient = new mindee.Client({ apiKey: key });

    const inputSource = mindeeClient.docFromPath(filePath);

    const customEndpoint = mindeeClient.createEndpoint(
      documentType,
      "Propellus"
    );

    const apiResponse = await mindeeClient.parse(
      mindee.product.CustomV1,
      inputSource,
      {
        endpoint: customEndpoint,
        cropper: true,
      }
    );
    const fieldsMap = apiResponse.document.inference.prediction.fields;

    const fieldsArray = Array.from(fieldsMap);
    const data = Object.fromEntries(fieldsArray);
    let obj = {};
    let content;
    for (const key in data) {
      if (data[key]?.values.length != 0) {
        content = data[key]?.values?.map((obj) => obj.content).join(" ");
      } else {
        content = null;
      }
      Object.assign(obj, { [key]: content });
    }
    const fields = apiResponse.document.inference.product.features;
    return {fields, data:obj}


  } catch {
    console.log(`${error.message}`.yellow);
    return res.status(500).json({ message: "error occurred" });
  }
}

const scanPakistaniPassport = async (req, res) => {
  try {
    const filePath = req.file.path;

    const apiResponse = await configureMindee(
      MINDI_API_KEY,
      filePath,
      "passport"
    );
    const fieldsMap = apiResponse.document.inference.prediction.fields;

    const fieldsArray = Array.from(fieldsMap);
    const data = Object.fromEntries(fieldsArray);
    let obj = {};
    let content;
    for (const key in data) {
      if (data[key]?.values.length != 0) {
        content = data[key]?.values?.map((obj) => obj.content).join(" ");
      } else {
        content = null;
      }
      Object.assign(obj, { [key]: content });
    }
    const fields = apiResponse.document.inference.product.features;
    return sendResponse(res, { success: true, fields, data: obj });
  } catch (error) {
    console.log(`${error.message}`.yellow);
    return res.status(500).json({ message: "error occurred" });
  }
};

const scanPermanentResidency = async (req, res) => {
  try {
    const filePath = req.file.path;

    const apiResponse = await configureMindee(
      MINDI_API_KEY,
      filePath,
      "permanent_residence_optimized_retrained"
    );

    const fieldsMap = apiResponse.document.inference.prediction.fields;

    const fieldsArray = Array.from(fieldsMap);
    const data = Object.fromEntries(fieldsArray);

    let obj = {};
    let content;

    for (const key in data) {
      if (data[key]?.values.length != 0) {
        content = data[key]?.values?.map((obj) => obj.content).join(" ");
      } else {
        content = null;
      }
      Object.assign(obj, { [key]: content });
    }
    const fields = apiResponse.document.inference.product.features;
    return sendResponse(res, { success: true, fields, data: obj });
  } catch (error) {
    console.log(`${error.message}`.yellow);
    return res.status(500).json({ message: "error occurred" });
  }
};

const scanPakistaniCnic = async (req, res) => {
  try {
    const filePath = req.file.path;

    const apiResponse = await configureMindee(MINDI_API_KEY, filePath, "cnic");

    const fieldsMap = apiResponse.document.inference.prediction.fields;

    const fieldsArray = Array.from(fieldsMap);
    const data = Object.fromEntries(fieldsArray);

    let obj = {};
    let content;

    for (const key in data) {
      if (data[key]?.values.length != 0) {
        content = data[key]?.values?.map((obj) => obj.content).join(" ");
      } else {
        content = null;
      }
      Object.assign(obj, { [key]: content });
    }
    const fields = apiResponse.document.inference.product.features;
    return sendResponse(res, { success: true, fields, data: obj });
  } catch (error) {
    console.log(`${error.message}`.yellow);
    return res.status(500).json({ message: "error occurred" });
  }
};


const scanDocument = async (req, res) => {
  try {

    const documentType  = req.body.documentType;
    
    const filePath =  req.file.path;

    if(!filePath || !documentType){
      return res.status(400).json({ message: "file path or document type is required" });
    }

    let { fields, data }= await configureMindee(MINDI_API_KEY, filePath, documentType)


    if(!fields || !data) {
      return res.status(404).json({ message: "data not found" });
    }
  
    return sendResponse(res, {success: true, documentType, fields, data })

  } catch (error) {
    console.log(`${error.message}`.yellow);
    return res.status(500).json({ message: "error occurred" });
  }
};

module.exports = {
  scanPakistaniPassport,
  scanPermanentResidency,
  scanPakistaniCnic,
  scanDocument,
};
