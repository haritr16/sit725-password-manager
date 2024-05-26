const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.post('/signup', mainController.signup);
router.post('/login', mainController.login);
router.post('/add-record', mainController.addRecord);
router.get('/get-records/:username', mainController.getRecords);
router.delete('/delete-record', mainController.deleteRecord);

module.exports = router;
