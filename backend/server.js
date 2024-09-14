require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const startCronJob = require('./utils/cron-jobs');

const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const tenderRouter = require('./routes/tender');
const mailRouter = require('./routes/mail');
const bidRouter = require('./routes/bid');
const smsRouter = require('./routes/sms');

// Create express server
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Variables
const port = process.env.PORT || 4000;
const uri = process.env.ATLAS_URI;

// Routers
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/tender', tenderRouter);
app.use('/api/mail', mailRouter);
app.use('/api/bid', bidRouter);
app.use('/api/sms', smsRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve the uploads folder as static files

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB database connection established successfully");
    // Start the cron job after MongoDB is connected
    startCronJob();
  })
  .catch((error) => console.error("MongoDB connection error:", error));



// Start backend server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
