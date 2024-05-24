const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://purvasha1013:Imp_560062@sit-725.b8fxacb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  iv: String // Store the initialization vector for decryption
});

const recordSchema = new mongoose.Schema({
  platform: String,
  username: String,
  password: String,
  iv: String // Store the initialization vector for decryption
});

const User = mongoose.model('User', userSchema);
const Record = mongoose.model('Record', recordSchema);

const algorithm = 'aes-256-cbc';
const secretKey = crypto.randomBytes(32); // Must be 256 bits (32 bytes)

// Function to encrypt data
function encrypt(text) {
  const iv = crypto.randomBytes(16); // Must be 128 bits (16 bytes)
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    content: encrypted
  };
}

// Function to decrypt data
function decrypt(encryptedData) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(encryptedData.iv, 'hex'));
  let decrypted = decipher.update(encryptedData.content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const encryptedPassword = encrypt(hashedPassword);

    const newUser = new User({ username, password: encryptedPassword.content, iv: encryptedPassword.iv });
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
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const decryptedPassword = decrypt({ content: user.password, iv: user.iv });

    const passwordMatch = await bcrypt.compare(password, decryptedPassword);
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
    const { platform, username, password } = req.body;

    const encryptedPassword = encrypt(password);

    const newRecord = new Record({
      platform,
      username,
      password: encryptedPassword.content,
      iv: encryptedPassword.iv
    });

    await newRecord.save();
    res.status(200).json({ message: 'Record added successfully' });
  } catch (error) {
    console.error('Error adding record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/get-records/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const records = await Record.find({ username });
    const decryptedRecords = records.map(record => ({
      platform: record.platform,
      username: record.username,
      password: decrypt({ content: record.password, iv: record.iv })
    }));
    res.status(200).json(decryptedRecords);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use(express.static('public'));

app.get('/login.html', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/signup.html', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.get('/password-view.html', (req, res) => {
  res.sendFile(__dirname + '/password-view.html');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
