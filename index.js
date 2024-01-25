const scan = require('./scanRoutes')
const {upload} = require("./storageMiddleware")
module.exports = (app) => {

    app.get("/", (req, res) => {
      return res.status(200).json({message: "welcome to node server"})
    });
    app.use('/docs', scan)
 
  
    app.use(function (req, res, next) {
      return res.status(404).json("Route does not exist")
    });
  };
  