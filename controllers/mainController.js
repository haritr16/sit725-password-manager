const User = require('../models/userModel');
const Record = require('../models/recordModel');
const bcrypt = require('bcrypt');

let var1 = '';

exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        var1 = username;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.addRecord = async (req, res) => {
    try {
        const { platform, username_platform, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newRecord = new Record({
            username: var1,
            platform,
            username_platform,
            password: hashedPassword
        });

        await newRecord.save();
        res.status(200).json({ message: 'Record added successfully' });
    } catch (error) {
        console.error('Error adding record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getRecords = async (req, res) => {
    try {
        const { username } = req.params;
        const records = await Record.find({ username: username });
        res.status(200).json(records);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteRecord = async (req, res) => {
    try {
        const { username, username_platform } = req.body;
        if (username !== var1) {
            return res.status(403).json({ message: 'You can only delete your own records.' });
        }
        const record = await Record.findOneAndDelete({ username, username_platform });
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
