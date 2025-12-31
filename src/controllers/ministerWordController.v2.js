const { MinisterMessage } = require('../models');
const logger = require('../config/logger');

// Get all minister messages
const getAllMinisterMessages = async (req, res) => {
  try {
    const messages = await MinisterMessage.findAll({
      order: [['posted_on', 'DESC']],
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
      where: { is_active: true },
      order: [['posted_on', 'DESC']],
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
      title_en,
      title_fr,
      content_en,
      content_fr,
      minister_name_en,
      minister_name_fr,
      minister_photo,
      is_active = true,
    } = req.body;

    if (!title_en || !title_fr || !content_en || !content_fr || !minister_name_en || !minister_name_fr) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields missing',
      });
    }

    // If setting as active, deactivate all other messages
    if (is_active) {
      await MinisterMessage.update(
        { is_active: false },
        { where: { is_active: true } }
      );
    }

    const message = await MinisterMessage.create({
      title_en,
      title_fr,
      content_en,
      content_fr,
      minister_name_en,
      minister_name_fr,
      minister_photo,
      is_active,
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
      title_en,
      title_fr,
      content_en,
      content_fr,
      minister_name_en,
      minister_name_fr,
      minister_photo,
      is_active,
    } = req.body;

    const message = await MinisterMessage.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Minister message not found',
      });
    }

    // If setting as active, deactivate all other messages
    if (is_active === true) {
      await MinisterMessage.update(
        { is_active: false },
        { where: { is_active: true, message_id: { [require('sequelize').Op.ne]: messageId } } }
      );
    }

    // Update fields
    if (title_en !== undefined) message.title_en = title_en;
    if (title_fr !== undefined) message.title_fr = title_fr;
    if (content_en !== undefined) message.content_en = content_en;
    if (content_fr !== undefined) message.content_fr = content_fr;
    if (minister_name_en !== undefined) message.minister_name_en = minister_name_en;
    if (minister_name_fr !== undefined) message.minister_name_fr = minister_name_fr;
    if (minister_photo !== undefined) message.minister_photo = minister_photo;
    if (is_active !== undefined) message.is_active = is_active;

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
