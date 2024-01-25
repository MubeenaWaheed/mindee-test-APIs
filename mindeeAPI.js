const mindee = require("mindee");
require("dotenv").config();
const { sendResponse } = require("./helpers");
const { MINDI_API_KEY } = process.env;
const { inspect } = require("util");

async function configureMindee (key, filePath, documentType ) {
  try{
    const mindeeClient = new mindee.Client({ apiKey: key });

    const inputSource = mindeeClient.docFromPath(filePath);

    const customEndpoint = mindeeClient.createEndpoint(
      documentType,
      "MubeenaWaheed"
    );
   
    const apiResponse = await mindeeClient.parse(
      mindee.product.CustomV1,
      inputSource,
      {
        endpoint: customEndpoint,
        cropper: true,
      }
    );
    return apiResponse
  }
  catch{
    console.log(`${error.message}`.yellow);
    return res.status(500).json({ message: "error occurred" });
  }
}

const scanPakistaniPassport = async (req, res) => {
  try {
    const filePath = req.file.path;

    const apiResponse = await configureMindee(MINDI_API_KEY, filePath, "passport_optimized")
    const fieldsMap = apiResponse.document.inference.prediction.fields;

    const fieldsArray = Array.from(fieldsMap);
    const data = Object.fromEntries(fieldsArray);
    let obj={};
    let content
    for (const key in data ){
      if (data[key]?.values.length != 0){
       content = data[key]?.values?.map(obj => obj.content).join(' ');
      }
      else{
        content=null
      }
      Object.assign(obj, { [key]: content });

    }
    const fields =apiResponse.document.inference.product.features
    return sendResponse(res, { success:true, fields, data:obj });

  } catch (error) {
    console.log(`${error.message}`.yellow);
    return res.status(500).json({ message: "error occurred" });
  }
};

const scanPermanentResidency = async(req, res)=>{
  try{
    const filePath = req.file.path;

    const apiResponse = await configureMindee(MINDI_API_KEY, filePath, "permanent_residence_optimized_retrained")
 
    const fieldsMap = apiResponse.document.inference.prediction.fields;

    const fieldsArray = Array.from(fieldsMap);
    const data = Object.fromEntries(fieldsArray);

    let obj={};
    let content

    for (const key in data ){
      if (data[key]?.values.length != 0){
       content = data[key]?.values?.map(obj => obj.content).join(' ');
      }
      else{
        content=null
      }
      Object.assign(obj, { [key]: content });

    }
    const fields =apiResponse.document.inference.product.features
    return sendResponse(res, {success:true, fields, data: obj})
  }
  catch(error){
    console.log(`${error.message}`.yellow);
    return res.status(500).json({ message: "error occurred" });
  }
}

const scanPakistaniCnic = async(req, res)=>{
  try{
    const filePath = req.file.path;

    const apiResponse = await configureMindee(MINDI_API_KEY, filePath, "cnic")

    const fieldsMap = apiResponse.document.inference.prediction.fields;

    const fieldsArray = Array.from(fieldsMap);
    const data = Object.fromEntries(fieldsArray);

    let obj={};
    let content

    for (const key in data ){
      if (data[key]?.values.length != 0){
       content = data[key]?.values?.map(obj => obj.content).join(' ');
      }
      else{
        content=null
      }
      Object.assign(obj, { [key]: content });

    }
    const fields =apiResponse.document.inference.product.features
    return sendResponse(res, {success:true, fields, data: obj})
  }
  catch(error){
    console.log(`${error.message}`.yellow);
    return res.status(500).json({ message: "error occurred" });
  }
}

module.exports = {
  scanPakistaniPassport,
  scanPermanentResidency,
  scanPakistaniCnic

};
