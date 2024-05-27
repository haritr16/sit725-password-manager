const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mainRoutes = require('./routes/mainRoutes');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const dbConfig = require('./config/db');
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected successfully to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  })

app.use('/', mainRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, 'public' , 'login.html'));
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
