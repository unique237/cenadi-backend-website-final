const { Fact } = require('../models');
const logger = require('../config/logger');

// Get all facts
const getAllFacts = async (req, res) => {
  try {
    const facts = await Fact.findAll({
      order: [['posted_on', 'DESC']],
    });

    logger.info(`Fetched ${facts.length} facts`);

    return res.status(200).json({ 
      success: true, 
      count: facts.length, 
      facts,
    });
  } catch (error) {
    logger.error('Get all facts error:', error);
    console.error('Fact model error details:', error.message, error.stack);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching facts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get fact by ID
const getFactById = async (req, res) => {
  try {
    const { factId } = req.params;

    const fact = await Fact.findByPk(factId);

    if (!fact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Fact not found',
      });
    }

    logger.info(`Fetched fact by ID: ${factId}`);

    return res.status(200).json({ 
      success: true, 
      fact,
    });
  } catch (error) {
    logger.error('Get fact by ID error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred',
    });
  }
};

// Create fact (Admin only)
const createFact = async (req, res) => {
  try {
    const { name_en, name_fr, content_en, content_fr, description_en, description_fr, icon_url } = req.body;

    if (!content_en || !content_fr) {
      return res.status(400).json({ 
        success: false, 
        message: 'Content in both languages required',
      });
    }

    const fact = await Fact.create({
      name_en,
      name_fr,
      content_en,
      content_fr,
      description_en,
      description_fr,
      icon_url,
    });

    logger.info(`Fact created by admin ${req.user.id}: ${fact.fact_id}`);

    return res.status(201).json({ 
      success: true, 
      message: 'Fact created successfully', 
      fact,
    });
  } catch (error) {
    logger.error('Create fact error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating fact',
    });
  }
};

// Update fact (Admin only)
const updateFact = async (req, res) => {
  try {
    const { factId } = req.params;
    const { name_en, name_fr, content_en, content_fr, description_en, description_fr, icon_url } = req.body;

    const fact = await Fact.findByPk(factId);
    if (!fact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Fact not found',
      });
    }

    // Update fields
    if (name_en !== undefined) fact.name_en = name_en;
    if (name_fr !== undefined) fact.name_fr = name_fr;
    if (content_en !== undefined) fact.content_en = content_en;
    if (content_fr !== undefined) fact.content_fr = content_fr;
    if (description_en !== undefined) fact.description_en = description_en;
    if (description_fr !== undefined) fact.description_fr = description_fr;
    if (icon_url !== undefined) fact.icon_url = icon_url;

    await fact.save();

    logger.info(`Fact updated by admin ${req.user.id}: ${factId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Fact updated successfully', 
      fact,
    });
  } catch (error) {
    logger.error('Update fact error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while updating fact',
    });
  }
};

// Delete fact (Admin only)
const deleteFact = async (req, res) => {
  try {
    const { factId } = req.params;

    const fact = await Fact.findByPk(factId);
    if (!fact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Fact not found',
      });
    }

    await fact.destroy();

    logger.info(`Fact deleted by admin ${req.user.id}: ${factId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Fact deleted successfully',
    });
  } catch (error) {
    logger.error('Delete fact error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while deleting fact',
    });
  }
};

module.exports = {
  getAllFacts,
  getFactById,
  createFact,
  updateFact,
  deleteFact,
};
