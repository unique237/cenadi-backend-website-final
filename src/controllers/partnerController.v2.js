const { Partner } = require('../models');
const logger = require('../config/logger');

// Get all partners
const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.findAll({
      order: [['created_at', 'DESC']],
    });

    logger.info(`Fetched ${partners.length} partners`);

    return res.status(200).json({ 
      success: true, 
      count: partners.length, 
      partners,
    });
  } catch (error) {
    logger.error('Get all partners error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching partners',
    });
  }
};

// Get partner by ID
const getPartnerById = async (req, res) => {
  try {
    const { partnerId } = req.params;

    const partner = await Partner.findByPk(partnerId);

    if (!partner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Partner not found',
      });
    }

    logger.info(`Fetched partner by ID: ${partnerId}`);

    return res.status(200).json({ 
      success: true, 
      partner,
    });
  } catch (error) {
    logger.error('Get partner by ID error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred',
    });
  }
};

// Create partner (Admin only)
const createPartner = async (req, res) => {
  try {
    const { name_en, name_fr, description_en, description_fr, logo_url, website } = req.body;

    if (!name_en || !name_fr || !description_en || !description_fr || !logo_url) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields missing',
      });
    }

    const partner = await Partner.create({
      name_en,
      name_fr,
      description_en,
      description_fr,
      logo_url,
      website,
    });

    logger.info(`Partner created by admin ${req.user.id}: ${partner.partner_id}`);

    return res.status(201).json({ 
      success: true, 
      message: 'Partner created successfully', 
      partner,
    });
  } catch (error) {
    logger.error('Create partner error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating partner',
    });
  }
};

// Update partner (Admin only)
const updatePartner = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { name_en, name_fr, description_en, description_fr, logo_url, website } = req.body;

    const partner = await Partner.findByPk(partnerId);
    if (!partner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Partner not found',
      });
    }

    // Update fields
    if (name_en !== undefined) partner.name_en = name_en;
    if (name_fr !== undefined) partner.name_fr = name_fr;
    if (description_en !== undefined) partner.description_en = description_en;
    if (description_fr !== undefined) partner.description_fr = description_fr;
    if (logo_url !== undefined) partner.logo_url = logo_url;
    if (website !== undefined) partner.website = website;

    await partner.save();

    logger.info(`Partner updated by admin ${req.user.id}: ${partnerId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Partner updated successfully', 
      partner,
    });
  } catch (error) {
    logger.error('Update partner error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while updating partner',
    });
  }
};

// Delete partner (Admin only)
const deletePartner = async (req, res) => {
  try {
    const { partnerId } = req.params;

    const partner = await Partner.findByPk(partnerId);
    if (!partner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Partner not found',
      });
    }

    await partner.destroy();

    logger.info(`Partner deleted by admin ${req.user.id}: ${partnerId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Partner deleted successfully',
    });
  } catch (error) {
    logger.error('Delete partner error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while deleting partner',
    });
  }
};

module.exports = {
  getAllPartners,
  getPartnerById,
  createPartner,
  updatePartner,
  deletePartner,
};
