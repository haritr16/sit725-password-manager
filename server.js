const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mainRoutes = require('./routes/mainRoutes');

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

  app.use('/', mainRoutes);

app.use(express.static('public'));

app.get('/login.html', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/signup.html', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

app.get('/password-view.html', (req, res) => {
    res.sendFile(__dirname + '/public/password-view.html');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
