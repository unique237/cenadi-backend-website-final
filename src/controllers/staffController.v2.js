const { Staff } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

// Get all staff members with pagination
const getAllStaff = async (req, res) => {
  try {
    const { page = 1, limit = 20, department } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (department) {
      where[Op.or] = [
        { department_en: department },
        { department_fr: department },
      ];
    }

    const { count, rows } = await Staff.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    logger.info(`Fetched ${rows.length} staff members (page ${page})`);

    return res.status(200).json({
      success: true,
      count: rows.length,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      staff: rows,
    });
  } catch (error) {
    logger.error('Get all staff error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while fetching staff',
    });
  }
};

// Get staff by ID
const getStaffById = async (req, res) => {
  try {
    const { staffId } = req.params;

    const staff = await Staff.findByPk(staffId);

    if (!staff) {
      return res.status(404).json({ 
        success: false, 
        message: 'Staff member not found',
      });
    }

    logger.info(`Fetched staff by ID: ${staffId}`);

    return res.status(200).json({ 
      success: true, 
      staff,
    });
  } catch (error) {
    logger.error('Get staff by ID error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred',
    });
  }
};

// Create staff member (Admin only)
const createStaff = async (req, res) => {
  try {
    const {
      name_en,
      name_fr,
      position_en,
      position_fr,
      department_en,
      department_fr,
      bio_en,
      bio_fr,
      photo_url,
      email,
      phone,
    } = req.body;

    // Validation
    if (!name_en || !name_fr || !position_en || !position_fr) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields missing',
      });
    }

    const staff = await Staff.create({
      name_en,
      name_fr,
      position_en,
      position_fr,
      department_en,
      department_fr,
      bio_en,
      bio_fr,
      photo_url,
      email,
      phone,
    });

    logger.info(`Staff member created by admin ${req.user.id}: ${staff.staff_id}`);

    return res.status(201).json({ 
      success: true, 
      message: 'Staff member created successfully', 
      staff,
    });
  } catch (error) {
    logger.error('Create staff error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating staff member',
    });
  }
};

// Update staff member (Admin only)
const updateStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const {
      name_en,
      name_fr,
      position_en,
      position_fr,
      department_en,
      department_fr,
      bio_en,
      bio_fr,
      photo_url,
      email,
      phone,
    } = req.body;

    const staff = await Staff.findByPk(staffId);
    if (!staff) {
      return res.status(404).json({ 
        success: false, 
        message: 'Staff member not found',
      });
    }

    // Update fields
    if (name_en !== undefined) staff.name_en = name_en;
    if (name_fr !== undefined) staff.name_fr = name_fr;
    if (position_en !== undefined) staff.position_en = position_en;
    if (position_fr !== undefined) staff.position_fr = position_fr;
    if (department_en !== undefined) staff.department_en = department_en;
    if (department_fr !== undefined) staff.department_fr = department_fr;
    if (bio_en !== undefined) staff.bio_en = bio_en;
    if (bio_fr !== undefined) staff.bio_fr = bio_fr;
    if (photo_url !== undefined) staff.photo_url = photo_url;
    if (email !== undefined) staff.email = email;
    if (phone !== undefined) staff.phone = phone;

    await staff.save();

    logger.info(`Staff member updated by admin ${req.user.id}: ${staffId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Staff member updated successfully', 
      staff,
    });
  } catch (error) {
    logger.error('Update staff error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while updating staff member',
    });
  }
};

// Delete staff member (Admin only)
const deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    const staff = await Staff.findByPk(staffId);
    if (!staff) {
      return res.status(404).json({ 
        success: false, 
        message: 'Staff member not found',
      });
    }

    await staff.destroy();

    logger.info(`Staff member deleted by admin ${req.user.id}: ${staffId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Staff member deleted successfully',
    });
  } catch (error) {
    logger.error('Delete staff error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while deleting staff member',
    });
  }
};

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
