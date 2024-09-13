const User = require('../models/user-model');
const Mail = require('../models/mail-model')

const getUserMails = async (req, res) => {
  const userId = req.user._id;
  const { unreadOnly, reverse } = req.query;

  try {
    // Construct the query object
    let query = {};

    if (unreadOnly === 'true') {
      query = { read: false }; // Filter for unread mails only
    }

    // Find the user and populate their inbox with all fields of the mail document and the sender's username
    const user = await User.findById(userId)
      .populate({
        path: 'inbox',
        match: query, // Apply the query filter for unread mails
        populate: {
          path: 'sender', // Populate the sender's username
          select: 'username',
        },
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if reverse is 'true' and reverse the inbox order
    let inbox = user.inbox;
    if (reverse === 'true') {
      inbox = inbox.reverse();
    }

    res.status(200).json(inbox); // Return the fully populated inbox
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Unable to fetch mails' });
  }
};


// Update mail status
const updateMailById = async (req, res) => {
  const { id } = req.params;
  const { read } = req.body; // Can add more fields to update

  try {
    const mail = await Mail.findById(id);
    if (!mail) {
      return res.status(404).json({ error: 'Mail not found' });
    }

    // Update the mail fields
    if (typeof read !== 'undefined') {
      mail.read = read;
    }

    const updatedMail = await mail.save();
    res.status(200).json(updatedMail);
  } catch (error) {
    res.status(500).json({ error: 'Unable to update mail' });
  }
};

// Mark all mails as read
const markAllMailsAsRead = async (req, res) => {
  try {
    await Mail.updateMany({ recipient: req.user._id, read: false }, { read: true });
    res.status(200).json({ message: 'All mails marked as read' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to mark all mails as read' });
  }
};

module.exports = { getUserMails, updateMailById, markAllMailsAsRead };