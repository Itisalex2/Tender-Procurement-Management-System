const Tender = require('../models/tender-model');

const createTender = async (req, res) => {
  try {
    const { title, description, issueDate, closingDate, contactInfo, otherRequirements } = req.body;

    // Process uploaded files
    const relatedFiles = req.files.map(file => ({
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
    }));

    // Parse contactInfo as it's sent as JSON string
    const contactDetails = JSON.parse(contactInfo);

    // Create a new tender
    const newTender = new Tender({
      title,
      description,
      issueDate,
      closingDate,
      contactInfo: contactDetails,
      otherRequirements,
      relatedFiles, // Store file data
    });

    // Save the tender to the database
    await newTender.save();

    res.status(201).json({ message: 'Tender created successfully', tender: newTender });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createTender };
