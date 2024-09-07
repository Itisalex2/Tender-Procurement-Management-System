require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routes/user');

// Create express server
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Variables
const port = process.env.PORT || 4000;
const uri = process.env.ATLAS_URI;

// Routers
app.use('/api/user', userRouter)

// Connect to MongoDB
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// Start backend server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});


