const { DirectorMessage } = require('../models');
const logger = require('../config/logger');

// Get all director messages
const getAllDirectorMessages = async (req, res) => {
  try {
    const messages = await DirectorMessage.findAll({
      order: [['created_at', 'DESC']],
    });

    logger.info(`Fetched ${messages.length} director messages`);

    return res.status(200).json({ 
      success: true, 
      count: messages.length, 
      messages,
    });
  } catch (error) {
    logger.error('Get all director messages error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching director messages',
    });
  }
};

// Get active director message
const getActiveDirectorMessage = async (req, res) => {
  try {
    const message = await DirectorMessage.findOne({
      order: [['created_at', 'DESC']],
    });

    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'No active director message found',
      });
    }

    logger.info(`Fetched active director message: ${message.message_id}`);

    return res.status(200).json({ 
      success: true, 
      message,
    });
  } catch (error) {
    logger.error('Get active director message error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred',
    });
  }
};

// Get director message by ID
const getDirectorMessageById = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await DirectorMessage.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Director message not found',
      });
    }

    logger.info(`Fetched director message by ID: ${messageId}`);

    return res.status(200).json({ 
      success: true, 
      message,
    });
  } catch (error) {
    logger.error('Get director message by ID error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred',
    });
  }
};

// Create director message (Admin only)
const createDirectorMessage = async (req, res) => {
  try {
    const {
      title_en,
      title_fr,
      content_en,
      content_fr,
      director_name,
      excerpt_en,
      excerpt_fr,
      image_url,
      x,
      linkedin,
      email,
    } = req.body;

    if (!title_en || !title_fr || !content_en || !content_fr || !director_name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields missing',
      });
    }

    const message = await DirectorMessage.create({
      title_en,
      title_fr,
      content_en,
      content_fr,
      director_name,
      excerpt_en,
      excerpt_fr,
      image_url,
      x,
      linkedin,
      email,
    });

    logger.info(`Director message created by admin ${req.user.id}: ${message.message_id}`);

    return res.status(201).json({ 
      success: true, 
      message: 'Director message created successfully', 
      data: message,
    });
  } catch (error) {
    logger.error('Create director message error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating director message',
    });
  }
};

// Update director message (Admin only)
const updateDirectorMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const {
      title_en,
      title_fr,
      content_en,
      content_fr,
      director_name,
      excerpt_en,
      excerpt_fr,
      image_url,
      x,
      linkedin,
      email,
    } = req.body;

    const message = await DirectorMessage.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Director message not found',
      });
    }

    if (title_en !== undefined) message.title_en = title_en;
    if (title_fr !== undefined) message.title_fr = title_fr;
    if (content_en !== undefined) message.content_en = content_en;
    if (content_fr !== undefined) message.content_fr = content_fr;
    if (director_name !== undefined) message.director_name = director_name;
    if (excerpt_en !== undefined) message.excerpt_en = excerpt_en;
    if (excerpt_fr !== undefined) message.excerpt_fr = excerpt_fr;
    if (image_url !== undefined) message.image_url = image_url;
    if (x !== undefined) message.x = x;
    if (linkedin !== undefined) message.linkedin = linkedin;
    if (email !== undefined) message.email = email;

    await message.save();

    logger.info(`Director message updated by admin ${req.user.id}: ${messageId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Director message updated successfully', 
      data: message,
    });
  } catch (error) {
    logger.error('Update director message error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while updating director message',
    });
  }
};

// Delete director message (Admin only)
const deleteDirectorMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await DirectorMessage.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Director message not found',
      });
    }

    await message.destroy();

    logger.info(`Director message deleted by admin ${req.user.id}: ${messageId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Director message deleted successfully',
    });
  } catch (error) {
    logger.error('Delete director message error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while deleting director message',
    });
  }
};

module.exports = {
  getAllDirectorMessages,
  getActiveDirectorMessage,
  getDirectorMessageById,
  createDirectorMessage,
  updateDirectorMessage,
  deleteDirectorMessage,
};
