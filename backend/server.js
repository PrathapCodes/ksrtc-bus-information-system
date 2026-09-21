const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialize MongoDB connection
require('./db');

const authRouter = require('./routes/auth');
const placesRouter = require('./routes/places');
const busesRouter = require('./routes/buses');
const queriesRouter = require('./routes/queries');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/places', placesRouter);
app.use('/api/buses', busesRouter);
app.use('/api/queries', queriesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
