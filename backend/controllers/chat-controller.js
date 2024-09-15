const Message = require('../models/message-model');
const User = require('../models/user-model');
const Conversation = require('../models/conversation-model');
const Tender = require('../models/tender-model');
const { permissionRoles } = require('../../frontend/src/utils/permissions');

const addMessageToConversation = async (req, res) => {
  const { id } = req.params; // tender ID
  const { content, tendererId } = req.body; // message content and tenderer ID from the request body
  const userId = req.user._id; // sender (user making the request)

  if (!content) {
    return res.status(400).json({ error: 'Message content cannot be empty' });
  }

  try {
    // Find the tender by ID
    const tender = await Tender.findById(id).populate('conversations');

    if (!tender) {
      return res.status(404).json({ error: '招标不存在' });
    }

    // If the request is from an admin/procurement member, use tendererId to find the conversation
    let conversation;

    if (permissionRoles.messageOnAllTenders.includes(req.user.role)) {
      // Admin or procurement member: find the conversation with the specified tenderer
      if (!tendererId) {
        return res.status(400).json({ error: 'Tenderer ID is required when sending a message as an admin' });
      }

      conversation = tender.conversations.find((conv) => conv.user.equals(tendererId));
    } else {
      // Tenderer: find their own conversation
      conversation = tender.conversations.find((conv) => conv.user.equals(userId));
    }

    if (!conversation) {
      // Create a new conversation only if no existing conversation is found
      conversation = new Conversation({
        tender: id,
        user: tendererId || userId, // For admins, the conversation is for the tenderer; otherwise, it's for the user
      });
      await conversation.save();

      // Add the new conversation to the tender
      tender.conversations.push(conversation._id);
      await tender.save();
    }

    // Create a new message
    const newMessage = new Message({
      sender: userId,
      content,
      conversation: conversation._id,
    });

    await newMessage.save();

    // Populate the message with sender's username before sending response
    const populatedMessage = await newMessage.populate('sender', 'username');

    // Add the message to the conversation
    conversation.messages.push(newMessage._id);
    conversation.lastUpdated = Date.now();
    await conversation.save();

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error. Unable to send message.' });
  }
};



// Controller to get all messages in a conversation for a tender
const getConversationMessages = async (req, res) => {
  const { id } = req.params; // tender id
  const userId = req.user._id; // authenticated user id

  try {
    // Find the conversation between the user and the tender
    const conversation = await Conversation.findOne({
      tender: id,
      user: userId,
    }).populate('messages').populate('user', 'username'); // Populate messages and user details

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.status(200).json(conversation.messages); // Send all messages in the conversation
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error. Unable to fetch messages.' });
  }
};

module.exports = { addMessageToConversation, getConversationMessages, }