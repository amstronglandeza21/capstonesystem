// server/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const uploadRoute = require('./routes/upload');
const fetchRoute = require('./routes/Fetch');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/thumbnails', express.static(path.join(__dirname, '/uploads/thumbnails')));

// Routes
app.use('/api/upload', uploadRoute);
app.use('/api/theses', fetchRoute);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/capstonesystem';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const server = app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});
