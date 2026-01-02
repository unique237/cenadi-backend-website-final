const { Asset } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

// Get all assets with pagination
const getAllAssets = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};

    const { count, rows } = await Asset.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    logger.info(`Fetched ${rows.length} assets (page ${page})`);

    return res.status(200).json({
      success: true,
      count: rows.length,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      assets: rows,
    });
  } catch (error) {
    logger.error('Get all assets error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while fetching assets',
    });
  }
};

// Get asset by ID
const getAssetById = async (req, res) => {
  try {
    const { assetId } = req.params;

    const asset = await Asset.findByPk(assetId);

    if (!asset) {
      return res.status(404).json({ 
        success: false, 
        message: 'Asset not found',
      });
    }

    logger.info(`Fetched asset by ID: ${assetId}`);

    return res.status(200).json({ 
      success: true, 
      asset,
    });
  } catch (error) {
    logger.error('Get asset by ID error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred',
    });
  }
};

// Create asset (Admin only)
const createAsset = async (req, res) => {
  try {
    const {
      title_en,
      title_fr,
      description_en,
      description_fr,
      image_url,
      file_url,
    } = req.body;

    if (!title_en || !title_fr || !file_url) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields missing',
      });
    }

    const asset = await Asset.create({
      title_en,
      title_fr,
      description_en,
      description_fr,
      image_url,
      file_url,
    });

    logger.info(`Asset created by admin ${req.user.id}: ${asset.asset_id}`);

    return res.status(201).json({ 
      success: true, 
      message: 'Asset created successfully', 
      asset,
    });
  } catch (error) {
    logger.error('Create asset error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating asset',
    });
  }
};

// Update asset (Admin only)
const updateAsset = async (req, res) => {
  try {
    const { assetId } = req.params;
    const {
      title_en,
      title_fr,
      description_en,
      description_fr,
      image_url,
      file_url,
    } = req.body;

    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ 
        success: false, 
        message: 'Asset not found',
      });
    }

    // Update fields
    if (title_en !== undefined) asset.title_en = title_en;
    if (title_fr !== undefined) asset.title_fr = title_fr;
    if (description_en !== undefined) asset.description_en = description_en;
    if (description_fr !== undefined) asset.description_fr = description_fr;
    if (image_url !== undefined) asset.image_url = image_url;
    if (file_url !== undefined) asset.file_url = file_url;

    await asset.save();

    logger.info(`Asset updated by admin ${req.user.id}: ${assetId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Asset updated successfully', 
      asset,
    });
  } catch (error) {
    logger.error('Update asset error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while updating asset',
    });
  }
};

// Delete asset (Admin only)
const deleteAsset = async (req, res) => {
  try {
    const { assetId } = req.params;

    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ 
        success: false, 
        message: 'Asset not found',
      });
    }

    await asset.destroy();

    logger.info(`Asset deleted by admin ${req.user.id}: ${assetId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Asset deleted successfully',
    });
  } catch (error) {
    logger.error('Delete asset error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while deleting asset',
    });
  }
};

// Search assets
const searchAssets = async (req, res) => {
  try {
    const { query, lang = 'en', page = 1, limit = 20 } = req.query;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required',
      });
    }

    const offset = (page - 1) * limit;

    const titleField = lang === 'fr' ? 'title_fr' : 'title_en';
    const descField = lang === 'fr' ? 'description_fr' : 'description_en';

    const { count, rows } = await Asset.findAndCountAll({
      where: {
        [Op.or]: [
          { [titleField]: { [Op.iLike]: `%${query}%` } },
          { [descField]: { [Op.iLike]: `%${query}%` } },
        ],
      },
         order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    logger.info(`Search assets for "${query}": ${rows.length} results`);

    return res.status(200).json({
      success: true,
      count: rows.length,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      assets: rows,
    });
  } catch (error) {
    logger.error('Search assets error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while searching assets',
    });
  }
};

module.exports = {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  searchAssets,
};
