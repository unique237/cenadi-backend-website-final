const { Newsletter } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

// Get all newsletters with pagination
const getAllNewsletters = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Newsletter.findAndCountAll({
      order: [['published_at', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    logger.info(`Fetched ${rows.length} newsletters (page ${page})`);

    return res.status(200).json({
      success: true,
      count: rows.length,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
      newsletters: rows,
    });
  } catch (error) {
    logger.error('Get all newsletters error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching newsletters',
    });
  }
};

// Get newsletter by ID
const getNewsletterById = async (req, res) => {
  try {
    const { newsletterId } = req.params;

    const newsletter = await Newsletter.findByPk(newsletterId);

    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter not found',
      });
    }

    logger.info(`Fetched newsletter by ID: ${newsletterId}`);

    return res.status(200).json({
      success: true,
      newsletter,
    });
  } catch (error) {
    logger.error('Get newsletter by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    });
  }
};

// Create newsletter (Admin only)
const createNewsletter = async (req, res) => {
  try {
    const { title_en, title_fr, content_en, content_fr, published_at } = req.body;

    if (!title_en && !title_fr) {
      return res.status(400).json({
        success: false,
        message: 'A title in English or French is required',
      });
    }

    const newsletter = await Newsletter.create({
      title_en,
      title_fr,
      content_en,
      content_fr,
      published_at,
    });

    logger.info(`Newsletter created by admin ${req.user.id}: ${newsletter.newsletter_id}`);

    return res.status(201).json({
      success: true,
      message: 'Newsletter created successfully',
      newsletter,
    });
  } catch (error) {
    logger.error('Create newsletter error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating newsletter',
    });
  }
};

// Update newsletter (Admin only)
const updateNewsletter = async (req, res) => {
  try {
    const { newsletterId } = req.params;
    const { title_en, title_fr, content_en, content_fr, published_at } = req.body;

    const newsletter = await Newsletter.findByPk(newsletterId);
    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter not found',
      });
    }

    if (title_en !== undefined) newsletter.title_en = title_en;
    if (title_fr !== undefined) newsletter.title_fr = title_fr;
    if (content_en !== undefined) newsletter.content_en = content_en;
    if (content_fr !== undefined) newsletter.content_fr = content_fr;
    if (published_at !== undefined) newsletter.published_at = published_at;

    await newsletter.save();

    logger.info(`Newsletter updated by admin ${req.user.id}: ${newsletterId}`);

    return res.status(200).json({
      success: true,
      message: 'Newsletter updated successfully',
      newsletter,
    });
  } catch (error) {
    logger.error('Update newsletter error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating newsletter',
    });
  }
};

// Delete newsletter (Admin only)
const deleteNewsletter = async (req, res) => {
  try {
    const { newsletterId } = req.params;

    const newsletter = await Newsletter.findByPk(newsletterId);
    if (!newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Newsletter not found',
      });
    }

    await newsletter.destroy();

    logger.info(`Newsletter deleted by admin ${req.user.id}: ${newsletterId}`);

    return res.status(200).json({
      success: true,
      message: 'Newsletter deleted successfully',
    });
  } catch (error) {
    logger.error('Delete newsletter error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting newsletter',
    });
  }
};

// Search newsletters by title or content
const searchNewsletters = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const newsletters = await Newsletter.findAll({
      where: {
        [Op.or]: [
          { title_en: { [Op.iLike]: `%${q}%` } },
          { title_fr: { [Op.iLike]: `%${q}%` } },
          { content_en: { [Op.iLike]: `%${q}%` } },
          { content_fr: { [Op.iLike]: `%${q}%` } },
        ],
      },
      order: [['published_at', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      count: newsletters.length,
      newsletters,
    });
  } catch (error) {
    logger.error('Search newsletters error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while searching newsletters',
    });
  }
};

module.exports = {
  getAllNewsletters,
  getNewsletterById,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  searchNewsletters,
};
