const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Convert allowed file types to a regular expression
const allowedFileTypesRegex = new RegExp(process.env.ALLOWED_FILE_TYPES);

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

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  // Use the converted regular expression to test file types
  const extname = allowedFileTypesRegex.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedFileTypesRegex.test(file.mimetype);

  if (extname && (mimeType || file.mimetype === 'application/vnd.ms-excel')) { // fix: .xls files are not being accepted
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file
    console.log('Invalid file type. Allowed types: JPEG, PNG, PDF, Word, Excel, PowerPoint, TXT, RTF, ZIP, RAR, and CAD files.');
    cb(new Error('Invalid file type. Allowed types: JPEG, PNG, PDF, Word, Excel, PowerPoint, TXT, RTF, ZIP, RAR, and CAD files.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: process.env.FILE_SIZE_LIMIT * 1024 * 1024 // Multiply environment variable for MB
  }
});

module.exports = upload;
