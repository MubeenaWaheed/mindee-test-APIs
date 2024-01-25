const express = require("express")
const app = express()
const port = 4500

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

require("./index")(app);

app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}/`);
  });