const express = require("express");
const router = express.Router();
const mindee = require('./mindeeAPI');
const { upload } = require("./storageMiddleware");

// router.post('/scan', upload.single("file"), mindee.scanPassport)
router.post('/scan-passport', upload.single("file"), mindee.scanPakistaniPassport)
router.post('/scan-PR', upload.single("file"), mindee.scanPermanentResidency)
router.post('/scan-cnic', upload.single("file"), mindee.scanPakistaniCnic)
router.post('/scan-document', upload.single("file"), mindee.scanDocument)

module.exports = router;