import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
    username: { type: String, required: true },
    platform: { type: String, required: true },
    username_platform: { type: String, required: true },
    password: { type: String, required: true },
    iv: { type: String, required: true }
});

const Record = mongoose.model('Record', recordSchema);
export default Record;
