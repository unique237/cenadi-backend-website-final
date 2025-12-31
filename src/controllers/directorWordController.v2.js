const { DirectorMessage } = require('../models');
const logger = require('../config/logger');

// Get all director messages
const getAllDirectorMessages = async (req, res) => {
  try {
    const messages = await DirectorMessage.findAll({
      order: [['posted_on', 'DESC']],
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
      where: { is_active: true },
      order: [['posted_on', 'DESC']],
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
      director_name_en,
      director_name_fr,
      director_photo,
      is_active = true,
    } = req.body;

    if (!title_en || !title_fr || !content_en || !content_fr || !director_name_en || !director_name_fr) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields missing',
      });
    }

    // If setting as active, deactivate all other messages
    if (is_active) {
      await DirectorMessage.update(
        { is_active: false },
        { where: { is_active: true } }
      );
    }

    const message = await DirectorMessage.create({
      title_en,
      title_fr,
      content_en,
      content_fr,
      director_name_en,
      director_name_fr,
      director_photo,
      is_active,
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
      director_name_en,
      director_name_fr,
      director_photo,
      is_active,
    } = req.body;

    const message = await DirectorMessage.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Director message not found',
      });
    }

    // If setting as active, deactivate all other messages
    if (is_active === true) {
      await DirectorMessage.update(
        { is_active: false },
        { where: { is_active: true, message_id: { [require('sequelize').Op.ne]: messageId } } }
      );
    }

    // Update fields
    if (title_en !== undefined) message.title_en = title_en;
    if (title_fr !== undefined) message.title_fr = title_fr;
    if (content_en !== undefined) message.content_en = content_en;
    if (content_fr !== undefined) message.content_fr = content_fr;
    if (director_name_en !== undefined) message.director_name_en = director_name_en;
    if (director_name_fr !== undefined) message.director_name_fr = director_name_fr;
    if (director_photo !== undefined) message.director_photo = director_photo;
    if (is_active !== undefined) message.is_active = is_active;

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
