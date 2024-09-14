const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    // Get the original filename and ensure it's decoded as UTF-8
    const originalName = file.originalname;

    // Create a Buffer from the original name in 'latin1' and convert it to UTF-8
    const safeName = Buffer.from(originalName, 'latin1').toString('utf8');

    // Prepend timestamp for uniqueness
    const timestamp = Date.now();

    // Combine the timestamp and the safe name
    const finalName = `${timestamp}-${safeName}`;

    cb(null, finalName);
  }
});

const upload = multer({ storage });

module.exports = upload;
