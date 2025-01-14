const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const config = require('./config');

const app = express();


// Connect to MongoDB
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json());

// Routes
app.use(router);

app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
