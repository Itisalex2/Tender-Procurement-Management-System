const Tender = require('../models/tender-model');
const { permissionRoles } = require('../../frontend/src/utils/permissions');
const fs = require('fs');
const path = require('path');
const Conversation = require('../models/conversation-model');
const Message = require('../models/message-model');
const convertToUTF8 = require("../utils/file-conversion");

const createTender = async (req, res) => {
  try {
    const { title, description, issueDate, closingDate, contactInfo, otherRequirements, targetedUsers, procurementGroup } = req.body;

    // Parse targetedUsers and procurementGroup from JSON strings
    const parsedTargetedUsers = JSON.parse(targetedUsers);
    const parsedProcurementGroup = JSON.parse(procurementGroup);


    // Process uploaded files, explicitly encoding the originalname to UTF-8
    const relatedFiles = req.files.map(file => ({
      fileName: convertToUTF8(file.originalname),
      fileUrl: `/uploads/${file.filename}`,
      uploadedBy: req.user._id,
    }));

    // Parse contactInfo as it's sent as a JSON string
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
      targetedUsers: parsedTargetedUsers, // Store targeted users as an array of ObjectIds
      procurementGroup: parsedProcurementGroup, // Store procurement group as an array of ObjectIds
    });

    // Save the tender to the database
    await newTender.save({ _userId: req.user._id, _changeReason: '创建招标/Create Tender' });

    res.status(201).json({ message: 'Tender created successfully', tender: newTender });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};



const getTenders = async (req, res) => {
  try {
    // Get query parameter (e.g., /tenders?status=open)
    const { status } = req.query;

    // Get user ID and role from the request (provided by the requireAuth middleware)
    const { _id, role } = req.user;

    // Build the query object for filtering
    const query = {};
    if (status !== 'all') {
      query.status = status; // Filter by status if provided (e.g., 'Open')
    }

    // Check if the user role has permission to view all tenders
    if (permissionRoles.viewAllTenders.includes(role)) {
      // If the user has permission to view all tenders, return tenders with the status filter
      const tenders = await Tender.find(query)
        .populate('targetedUsers', 'username email role') // Populate targetedUsers
        .populate('procurementGroup', 'username') // Populate procurementGroup
        .populate({
          path: 'bids', // First, populate the 'bids' field
          populate: {
            path: 'bidder', // Then, populate the 'bidder' field inside each bid
            select: 'username' // Specify the fields to include from the bidder
          }
        });
      return res.status(200).json(tenders);
    } else {
      // If the user does not have permission to view all tenders, filter by targetedUsers
      query.targetedUsers = _id; // Only return tenders where the user is targeted
      const tenders = await Tender.find(query).populate('targetedUsers', 'username email role').populate('procurementGroup', 'username');
      return res.status(200).json(tenders);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tenders' });
  }
};

const updateTenderById = async (req, res) => {
  try {
    const tenderId = req.params.id;
    const { title, description, issueDate, closingDate, contactInfo, otherRequirements, targetedUsers, procurementGroup, changeReason } = req.body;

    if (!changeReason) {
      return res.status(400).json({ error: 'Change reason is required' });
    }

    // Parse contactInfo, targetedUsers, and procurementGroup if they are sent as JSON strings
    const updatedData = {
      title,
      description,
      issueDate,
      closingDate,
      contactInfo: JSON.parse(contactInfo),
      otherRequirements,
      targetedUsers: targetedUsers ? JSON.parse(targetedUsers) : [], // Parse targetedUsers array
      procurementGroup: procurementGroup ? JSON.parse(procurementGroup) : [], // Parse procurementGroup array
    };

    // Retrieve the existing tender to preserve existing files
    const existingTender = await Tender.findById(tenderId);

    // Append new files to the existing ones
    if (req.files.length > 0) {
      const newFiles = req.files.map(file => ({
        fileName: convertToUTF8(file.originalname), // Convert originalname to UTF-8
        fileUrl: `/uploads/${file.filename}`,
        uploadedBy: req.user._id,
      }));

      // Append the new files to the existing relatedFiles
      updatedData.relatedFiles = [...existingTender.relatedFiles, ...newFiles];
    } else {
      // If no new files, keep the existing relatedFiles
      updatedData.relatedFiles = existingTender.relatedFiles;
    }

    // Update the tender with the new data
    Object.assign(existingTender, updatedData);

    // Save the updated tender (this will trigger the versioning due to the pre-save middleware)
    const updatedTender = await existingTender.save({ _userId: req.user._id, _changeReason: changeReason });

    res.status(200).json(updatedTender);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};



const getTenderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { populate } = req.query; // Check for the populate query parameter

    // Start building the query to find the tender
    let query = Tender.findById(id)
      .populate('targetedUsers', 'username') // Populate targetedUsers' username
      .populate('procurementGroup', 'username') // Populate procurementGroup's username
      .populate({
        path: 'relatedFiles.uploadedBy', // Populate the uploadedBy field within relatedFiles
        select: 'username', // Only return the username for uploadedBy
      })
      .populate({
        path: 'bids',
        populate: {
          path: 'bidder',
          select: 'username',
        }
      });

    // If the populate query contains 'conversations', populate the conversations
    if (populate === 'conversations') {
      query = query.populate({
        path: 'conversations',
        populate: [
          {
            path: 'user', // Populate the user field in conversations
            select: 'username', // Only return the username for the user
          },
          {
            path: 'messages',
            populate: {
              path: 'sender',
              select: 'username', // Only return the username for the sender
            },
          },
        ],
      });
    }

    // Execute the query
    const tender = await query;

    if (!tender) {
      return res.status(404).json({ error: '招标不存在' });
    }

    res.status(200).json(tender);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tender' });
  }
};


const deleteTenderById = async (req, res) => {
  try {
    const tenderId = req.params.id;

    // Find the tender by ID first
    const tender = await Tender.findById(tenderId);

    if (!tender) {
      return res.status(404).json({ error: '招标不存在' });
    }

    // Delete all related files from the file system
    if (tender.relatedFiles && tender.relatedFiles.length > 0) {
      tender.relatedFiles.forEach((file) => {
        const filePath = path.join(__dirname, '..', file.fileUrl); // Resolve the file path
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete file ${file.fileName}:`, err);
          }
        });
      });
    }

    // Delete the tender from the database
    await Tender.findByIdAndDelete(tenderId);

    res.status(200).json({ message: 'Tender and related files deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete tender' });
  }
};

const changeTenderStatusToNegotiationCandidatesSelected = async (req, res) => {
  const { id } = req.params;
  const tenderId = id;

  try {
    // Find the tender by its ID
    const tender = await Tender.findById(tenderId);

    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    // Ensure that the current status is 'ClosedAndCanSeeBids'
    if (tender.status !== 'ClosedAndCanSeeBids') {
      return res.status(400).json({ error: 'Invalid status for this action' });
    }

    // Change the status to 'NegotiationCandidatesSelected'
    tender.status = 'NegotiationCandidatesSelected';
    await tender.save();

    res.status(200).json(tender);
  } catch (error) {
    console.error('Error updating tender status:', error);
    res.status(500).json({ error: 'Failed to update tender status' });
  }
};


module.exports = {
  createTender, getTenders, updateTenderById, getTenderById, deleteTenderById, changeTenderStatusToNegotiationCandidatesSelected,
};
