const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
let var1= "";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://vivekolladapu5:vivek12345@cluster0.b1rc26m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const recordSchema = new mongoose.Schema({
    username:String,
    platform: String,
    username_platform: String,
    password: String
});

const User = mongoose.model('User', userSchema);
const Record = mongoose.model('Record', recordSchema);

// app.post('/signup', async (req, res) => {
//     try {
//         const { username, password } = req.body; 

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new User({ username, password: hashedPassword });
//         await newUser.save();

//         res.status(201).json({ message: 'Account created successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body; 

        // Check if the username already exists
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
});


app.post('/login', async (req, res) => {
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
});

app.post('/add-record', async (req, res) => {
    try {
        const { platform, username_platform, password } = req.body;
        

        console.log('Received data:', req.body);  // Log the received data for debugging

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before saving

        const newRecord = new Record({
            username: var1,
            platform,
            username_platform,
            password: hashedPassword
        });

        await newRecord.save();
        res.status(200).json({ message: 'Record added successfully' });
    } catch (error) {
        console.error('Error adding record:', error);  // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/get-records/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const records = await Record.find({ username: username });
        res.status(200).json(records);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



// DELETE request to delete a record
app.delete('/delete-record', async (req, res) => {
    try {
        const { username, username_platform } = req.body;
        if (username !== var1) {
            return res.status(403).json({ message: 'Forbidden: You can only delete your own records.' });
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
});


app.use(express.static('public'));

// GET request to serve login page
app.get('/login.html', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// GET request to serve sign up page
app.get('/signup.html', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

// GET request to serve password view page
app.get('/password-view.html', (req, res) => {
    res.sendFile(__dirname + '/password-view.html');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
