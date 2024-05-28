import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import mainRoutes from './routes/mainRoutes.js';
import dbConfig from './config/db.js';
import path from 'path';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(path.resolve(), 'public')));
app.use('/', mainRoutes);

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await mongoose.connect(dbConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected successfully to MongoDB');

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

startServer();

export default app;
