const { Fact } = require('../models');
const logger = require('../config/logger');

// Get all facts
const getAllFacts = async (req, res) => {
  try {
    const facts = await Fact.findAll({
      order: [['created_at', 'DESC']],
    });

    logger.info(`Fetched ${facts.length} facts`);

    return res.status(200).json({ 
      success: true, 
      count: facts.length, 
      facts,
    });
  } catch (error) {
    logger.error('Get all facts error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching facts',
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
    const { content_en, content_fr } = req.body;

    if (!content_en || !content_fr) {
      return res.status(400).json({ 
        success: false, 
        message: 'Content in both languages required',
      });
    }

    const fact = await Fact.create({
      content_en,
      content_fr,
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
    const { content_en, content_fr } = req.body;

    const fact = await Fact.findByPk(factId);
    if (!fact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Fact not found',
      });
    }

    // Update fields
    if (content_en !== undefined) fact.content_en = content_en;
    if (content_fr !== undefined) fact.content_fr = content_fr;

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
