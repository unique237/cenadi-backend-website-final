const { MinisterMessage } = require('../models');
const logger = require('../config/logger');

// Get all minister messages
const getAllMinisterMessages = async (req, res) => {
  try {
    const messages = await MinisterMessage.findAll({
      order: [['created_at', 'DESC']],
    });

    logger.info(`Fetched ${messages.length} minister messages`);

    return res.status(200).json({ 
      success: true, 
      count: messages.length, 
      messages,
    });
  } catch (error) {
    logger.error('Get all minister messages error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching minister messages',
    });
  }
};

// Get active minister message
const getActiveMinisterMessage = async (req, res) => {
  try {
    const message = await MinisterMessage.findOne({
      order: [['created_at', 'DESC']],
    });

    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'No active minister message found',
      });
    }

    logger.info(`Fetched active minister message: ${message.message_id}`);

    return res.status(200).json({ 
      success: true, 
      message,
    });
  } catch (error) {
    logger.error('Get active minister message error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred',
    });
  }
};

// Get minister message by ID
const getMinisterMessageById = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await MinisterMessage.findByPk(messageId);

    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Minister message not found',
      });
    }

    logger.info(`Fetched minister message by ID: ${messageId}`);

    return res.status(200).json({ 
      success: true, 
      message,
    });
  } catch (error) {
    logger.error('Get minister message by ID error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred',
    });
  }
};

// Create minister message (Admin only)
const createMinisterMessage = async (req, res) => {
  try {
    const {
      content_en,
      content_fr,
      minister_name,
      image_url,
      telephone,
      email,
      website,
    } = req.body;

    if (!content_en || !content_fr || !minister_name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields missing',
      });
    }

    const message = await MinisterMessage.create({
      content_en,
      content_fr,
      minister_name,
      image_url,
      telephone,
      email,
      website,
    });

    logger.info(`Minister message created by admin ${req.user.id}: ${message.message_id}`);

    return res.status(201).json({ 
      success: true, 
      message: 'Minister message created successfully', 
      data: message,
    });
  } catch (error) {
    logger.error('Create minister message error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating minister message',
    });
  }
};

// Update minister message (Admin only)
const updateMinisterMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const {
      content_en,
      content_fr,
      minister_name,
      image_url,
      telephone,
      email,
      website,
    } = req.body;

    const message = await MinisterMessage.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Minister message not found',
      });
    }

    if (content_en !== undefined) message.content_en = content_en;
    if (content_fr !== undefined) message.content_fr = content_fr;
    if (minister_name !== undefined) message.minister_name = minister_name;
    if (image_url !== undefined) message.image_url = image_url;
    if (telephone !== undefined) message.telephone = telephone;
    if (email !== undefined) message.email = email;
    if (website !== undefined) message.website = website;

    await message.save();

    logger.info(`Minister message updated by admin ${req.user.id}: ${messageId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Minister message updated successfully', 
      data: message,
    });
  } catch (error) {
    logger.error('Update minister message error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while updating minister message',
    });
  }
};

// Delete minister message (Admin only)
const deleteMinisterMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await MinisterMessage.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Minister message not found',
      });
    }

    await message.destroy();

    logger.info(`Minister message deleted by admin ${req.user.id}: ${messageId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Minister message deleted successfully',
    });
  } catch (error) {
    logger.error('Delete minister message error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while deleting minister message',
    });
  }
};

module.exports = {
  getAllMinisterMessages,
  getActiveMinisterMessage,
  getMinisterMessageById,
  createMinisterMessage,
  updateMinisterMessage,
  deleteMinisterMessage,
};
