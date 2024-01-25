const sendResponse = (res, code, obj) => {
    if (!Number.isInteger(code)) {
      obj = code;
      code = 200;
    }
    if (!res.headersSent) return res.status(code).json(obj);
  };
  

module.exports = {sendResponse}