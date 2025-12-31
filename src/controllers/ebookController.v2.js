const { Ebook } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

// Get all ebooks with pagination
const getAllEbooks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Ebook.findAndCountAll({
      order: [['added_on', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    logger.info(`Fetched ${rows.length} ebooks (page ${page})`);

    return res.status(200).json({
      success: true,
      count: rows.length,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      ebooks: rows,
    });
  } catch (error) {
    logger.error('Get all ebooks error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while fetching ebooks',
    });
  }
};

// Get ebook by ID
const getEbookById = async (req, res) => {
  try {
    const { ebookId } = req.params;

    const ebook = await Ebook.findByPk(ebookId);

    if (!ebook) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ebook not found',
      });
    }

    logger.info(`Fetched ebook by ID: ${ebookId}`);

    return res.status(200).json({ 
      success: true, 
      ebook,
    });
  } catch (error) {
    logger.error('Get ebook by ID error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred',
    });
  }
};

// Create ebook (Admin only)
const createEbook = async (req, res) => {
  try {
    const {
      title_en,
      title_fr,
      description_en,
      description_fr,
      author_en,
      author_fr,
      cover_url,
      file_url,
      file_size,
      pages,
      published_date,
    } = req.body;

    if (!title_en || !title_fr || !file_url) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields missing',
      });
    }

    const ebook = await Ebook.create({
      title_en,
      title_fr,
      description_en,
      description_fr,
      author_en,
      author_fr,
      cover_url,
      file_url,
      file_size,
      pages,
      published_date,
    });

    logger.info(`Ebook created by admin ${req.user.id}: ${ebook.ebook_id}`);

    return res.status(201).json({ 
      success: true, 
      message: 'Ebook created successfully', 
      ebook,
    });
  } catch (error) {
    logger.error('Create ebook error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating ebook',
    });
  }
};

// Update ebook (Admin only)
const updateEbook = async (req, res) => {
  try {
    const { ebookId } = req.params;
    const {
      title_en,
      title_fr,
      description_en,
      description_fr,
      author_en,
      author_fr,
      cover_url,
      file_url,
      file_size,
      pages,
      published_date,
    } = req.body;

    const ebook = await Ebook.findByPk(ebookId);
    if (!ebook) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ebook not found',
      });
    }

    // Update fields
    if (title_en !== undefined) ebook.title_en = title_en;
    if (title_fr !== undefined) ebook.title_fr = title_fr;
    if (description_en !== undefined) ebook.description_en = description_en;
    if (description_fr !== undefined) ebook.description_fr = description_fr;
    if (author_en !== undefined) ebook.author_en = author_en;
    if (author_fr !== undefined) ebook.author_fr = author_fr;
    if (cover_url !== undefined) ebook.cover_url = cover_url;
    if (file_url !== undefined) ebook.file_url = file_url;
    if (file_size !== undefined) ebook.file_size = file_size;
    if (pages !== undefined) ebook.pages = pages;
    if (published_date !== undefined) ebook.published_date = published_date;

    await ebook.save();

    logger.info(`Ebook updated by admin ${req.user.id}: ${ebookId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Ebook updated successfully', 
      ebook,
    });
  } catch (error) {
    logger.error('Update ebook error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while updating ebook',
    });
  }
};

// Delete ebook (Admin only)
const deleteEbook = async (req, res) => {
  try {
    const { ebookId } = req.params;

    const ebook = await Ebook.findByPk(ebookId);
    if (!ebook) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ebook not found',
      });
    }

    await ebook.destroy();

    logger.info(`Ebook deleted by admin ${req.user.id}: ${ebookId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Ebook deleted successfully',
    });
  } catch (error) {
    logger.error('Delete ebook error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while deleting ebook',
    });
  }
};

// Search ebooks
const searchEbooks = async (req, res) => {
  try {
    const { query, lang = 'en', page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required',
      });
    }

    const offset = (page - 1) * limit;

    const titleField = lang === 'fr' ? 'title_fr' : 'title_en';
    const authorField = lang === 'fr' ? 'author_fr' : 'author_en';

    const { count, rows } = await Ebook.findAndCountAll({
      where: {
        [Op.or]: [
          { [titleField]: { [Op.iLike]: `%${query}%` } },
          { [authorField]: { [Op.iLike]: `%${query}%` } },
        ],
      },
      order: [['added_on', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    logger.info(`Search ebooks for "${query}": ${rows.length} results`);

    return res.status(200).json({
      success: true,
      count: rows.length,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      ebooks: rows,
    });
  } catch (error) {
    logger.error('Search ebooks error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while searching ebooks',
    });
  }
};

module.exports = {
  getAllEbooks,
  getEbookById,
  createEbook,
  updateEbook,
  deleteEbook,
  searchEbooks,
};
