import express from 'express';
import { signup, login, addRecord, getRecords, deleteRecord } from '../controllers/mainController.js';
import path from 'path';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/add-record', addRecord);
router.get('/get-records/:username', getRecords);
router.delete('/delete-record', deleteRecord);

router.get('/', (req, res) => {
  res.sendFile(path.resolve('public/login.html'));
});

export default router;
