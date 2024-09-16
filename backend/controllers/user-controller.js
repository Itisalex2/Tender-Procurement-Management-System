const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const Mail = require('../models/mail-model');
const roles = require('../../frontend/src/utils/roles');
const TendererDetails = require('../models/tenderer-details-model'); // Import the TendererDetails model

// Helper function to create a token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// User login
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    const token = createToken(user._id); // create token
    res.status(200).json({
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// User signup
const userSignup = async (req, res) => {
  const { username, email, password, number } = req.body;
  try {
    const user = await User.signup(username, email, password, number);
    const token = createToken(user._id);
    res.status(200).json({
      token
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update user settings
const userSettings = async (req, res) => {
  const userId = req.user._id;
  const updates = req.body;

  try {
    // Only allow specific fields to be updated
    const allowedUpdates = ['username', 'email', 'number', 'password'];
    const requestedUpdates = Object.keys(updates);
    const isValidOperation = requestedUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    // If updating the password, hash it before saving
    if (updates.password) {
      const bcrypt = require('bcrypt');
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    // Find user and update the fields
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true
    });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send back only the fields that were updated
    const response = {};
    requestedUpdates.forEach(update => {
      response[update] = updatedUser[update];
    });

    res.status(200).json(response); // Respond with updated fields
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch the authenticated user's info
const getUserInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const { includeBids, populate } = req.query; // Get both `includeBids` and `populate` from query parameters

    // Construct the query to exclude password
    let query = User.findById(userId).select('-password');

    // Optionally populate bids and their related tenders
    if (includeBids === 'true') {
      query = query.populate({
        path: 'bids',
        populate: { path: 'tender', select: 'title' }, // Populate the related tender's title for each bid
      });
    }

    // Optionally populate tendererDetails
    if (populate === 'tendererDetails') {
      query = query.populate('tendererDetails');
    }

    const user = await query;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};



const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query; // Get the 'role' query parameter from the request

    // Create a query object. If 'role' is provided, use it to filter users by role.
    const query = role ? { role: { $in: role.split(',') } } : {}; // Allow multiple roles by splitting with ','

    // Find users that match the query, and exclude the password from the results.
    const users = await User.find(query).select('-password');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Fetch any user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the route parameter

    // Fetch the user and populate 'tendererDetails' and nested 'comments.commenter'
    const user = await User.findById(id)
      .select('-password') // Exclude the password
      .populate({
        path: 'bids',
        populate: {
          path: 'tender', // Populate the tender field inside each bid
          select: 'title' // Only select the title field from the tender
        }
      })
      .populate({
        path: 'tendererDetails', // Populate tendererDetails
        populate: {
          path: 'comments.commenter', // Populate the commenter inside comments
          select: 'username email' // Only select relevant fields from the user who commented
        }
      });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user); // Send back the user data
  } catch (error) {
    console.error('Server error:', error); // Log the error for debugging
    res.status(500).json({ error: 'Server error' });
  }
};

const updateUserById = async (req, res) => {
  const userId = req.params.id;
  const { username, email, password, number, role, newMail, newBidId, tendererDetails } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId).populate('tendererDetails'); // Populate tendererDetails

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields if provided
    if (username) {
      user.username = username;
    }

    if (email) {
      // Check if the new email is valid
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      // Check if email is already in use
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ error: 'Email is already in use' });
      }

      user.email = email;
    }

    if (password) {
      // Check if the new password is strong
      if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ error: 'Password does not meet strength requirements' });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      user.password = hash;
    }

    if (number) {
      user.number = number;
    }

    if (role) {
      // Ensure the role is one of the allowed values
      if (!roles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      user.role = role;
    }

    // Add new mail to inbox if provided
    if (newMail) {
      // Create a new Mail document
      const mail = new Mail(newMail);
      await mail.save();

      // Add the new mail's ObjectId to the user's inbox
      user.inbox.push(mail._id);
    }

    if (newBidId) {
      user.bids.push(newBidId);
    }

    // Update tenderer details if provided
    if (tendererDetails) {
      // Check if tenderer details already exist
      if (!user.tendererDetails) {
        console.log('user.tendererDetails does not exist');
      } else {
        const existingTendererDetails = await TendererDetails.findById(user.tendererDetails);

        // Update tenderer details fields
        if (tendererDetails.businessLicense) {
          existingTendererDetails.businessLicense = tendererDetails.businessLicense;
        }
        if (tendererDetails.businessType) {
          existingTendererDetails.businessType = tendererDetails.businessType;
        }
        if (tendererDetails.legalRepresentative) {
          existingTendererDetails.legalRepresentative = tendererDetails.legalRepresentative;
        }
        if (tendererDetails.dateOfEstablishment) {
          existingTendererDetails.dateOfEstablishment = tendererDetails.dateOfEstablishment;
        }
        if (tendererDetails.country) {
          existingTendererDetails.country = tendererDetails.country;
        }
        if (tendererDetails.officeAddress) {
          existingTendererDetails.officeAddress = tendererDetails.officeAddress;
        }
        if (tendererDetails.legalRepresentativeBusinessCard) {
          existingTendererDetails.legalRepresentativeBusinessCard = tendererDetails.legalRepresentativeBusinessCard;
        }
        if (tendererDetails.unifiedSocialCreditCode) {
          existingTendererDetails.unifiedSocialCreditCode = tendererDetails.unifiedSocialCreditCode;
        }

        // Add a single comment if provided
        if (tendererDetails.newComment) {
          existingTendererDetails.comments.push({
            commenter: tendererDetails.newComment.commenter, // Make sure this is an ObjectId
            comment: tendererDetails.newComment.comment, // Actual comment text
          });
        }

        existingTendererDetails.verified = tendererDetails.verified;

        await existingTendererDetails.save();
      }
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
};


const updateTendererDetails = async (req, res) => {
  try {

    // Retrieve the files from the request
    const files = req.files;

    // Extract file paths (assuming order is maintained)
    const businessLicense = files[0] ? files[0].filename : null;
    const legalRepresentativeBusinessCard = files[1] ? files[1].filename : null;

    // Extract other fields from req.body
    const { businessType, legalRepresentative, dateOfEstablishment, country, officeAddress, unifiedSocialCreditCode } = req.body;

    // Validate that the required fields are provided
    if (!businessType || !legalRepresentative || !dateOfEstablishment || !country || !officeAddress || !unifiedSocialCreditCode) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Get the authenticated user's ID
    const userId = req.user._id;

    // Find the user by ID
    const user = await User.findById(userId).populate('tendererDetails'); // Populate tendererDetails

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let tendererDetails;

    // Check if tendererDetails exists for the user
    if (!user.tendererDetails) {
      // If no tendererDetails, create a new one
      tendererDetails = new TendererDetails({
        businessLicense,
        legalRepresentativeBusinessCard,
        businessType,
        legalRepresentative,
        dateOfEstablishment,
        country,
        officeAddress,
        unifiedSocialCreditCode
      });

      // Save the new TendererDetails document
      await tendererDetails.save();

      // Link the new TendererDetails to the user
      user.tendererDetails = tendererDetails._id;
    } else {
      // If tendererDetails exists, update the existing document
      tendererDetails = await TendererDetails.findById(user.tendererDetails._id);

      tendererDetails.businessLicense = businessLicense || tendererDetails.businessLicense;  // Only update if new file is provided
      tendererDetails.legalRepresentativeBusinessCard = legalRepresentativeBusinessCard || tendererDetails.legalRepresentativeBusinessCard;  // Only update if new file is provided
      tendererDetails.businessType = businessType;
      tendererDetails.legalRepresentative = legalRepresentative;
      tendererDetails.dateOfEstablishment = dateOfEstablishment;
      tendererDetails.country = country;
      tendererDetails.officeAddress = officeAddress;
      tendererDetails.unifiedSocialCreditCode = unifiedSocialCreditCode;

      // Save the updated TendererDetails document
      await tendererDetails.save();
    }

    // Save the user with the updated reference
    await user.save();

    res.status(200).json({ message: 'Tenderer details updated successfully', tendererDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating tenderer details' });
  }
};

// Controller to fetch tenderers with optional filtering
const getTenderers = async (req, res) => {
  try {
    const { verified } = req.query; // Get the 'verified' query parameter

    // Construct the query to fetch tenderers
    let query = { role: 'tenderer' };

    // Fetch all tenderers and populate their tendererDetails
    let tenderers = await User.find(query).populate('tendererDetails').select('-password');

    // If the 'verified' query parameter is provided, filter the results
    if (verified !== undefined) {
      const isVerified = verified === 'true'; // Convert string to boolean

      // Filter based on the presence of tendererDetails and verified status
      tenderers = tenderers.filter(tenderer => {
        if (tenderer.tendererDetails) {
          return tenderer.tendererDetails.verified === isVerified;
        }
        return !isVerified; // If tendererDetails is null, count as unverified
      });
    }

    res.status(200).json(tenderers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenderers' });
  }
};

module.exports = { userSignup, userLogin, userSettings, getUserInfo, getAllUsers, getUserById, updateUserById, updateTendererDetails, getTenderers };
