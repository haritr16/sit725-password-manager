const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');

router.post('/add-record', recordController.addRecord);
router.get('/get-records/:username', recordController.getRecords);
router.delete('/delete-record', recordController.deleteRecord);

module.exports = router;
