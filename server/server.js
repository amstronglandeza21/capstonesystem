require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const uploadRoute = require('./routes/upload');
const fetchRoute = require('./routes/Fetch');

const app = express();  // <-- Initialize express app BEFORE using it

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/thumbnails', express.static('server/uploads/thumbnails'));

// Routes
app.use('/api/upload', uploadRoute);
app.use('/api/theses', fetchRoute); // GET route to fetch theses

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('SIGINT', () => {
  console.log('Closing server...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});
