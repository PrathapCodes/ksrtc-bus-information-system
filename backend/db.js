const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/businfo';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.error('Please make sure MongoDB is running and connection string is correct.');
  console.error('Connection URI:', MONGODB_URI);
});

module.exports = mongoose;
