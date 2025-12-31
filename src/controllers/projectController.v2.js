const { Project } = require('../models');
const logger = require('../config/logger');

// Get all projects with pagination
const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Project.findAndCountAll({
      order: [['posted_on', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    logger.info(`Fetched ${rows.length} projects (page ${page})`);

    return res.status(200).json({
      success: true,
      count: rows.length,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      projects: rows,
    });
  } catch (error) {
    logger.error('Get all projects error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while fetching projects',
    });
  }
};

// Get project by ID
const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ 
        success: false,
        message: 'Project not found',
      });
    }

    logger.info(`Fetched project by ID: ${projectId}`);

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    logger.error('Get project by ID error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while fetching project',
    });
  }
};

// Create new project (Admin only)
const createProject = async (req, res) => {
  try {
    const {
      title_en,
      title_fr,
      description_en,
      description_fr,
      link = 'cenadi.cm',
      image_url,
    } = req.body;

    // Validation
    if (!title_en || !title_fr || !description_en || !description_fr) {
      return res.status(400).json({ 
        success: false,
        message: 'All required fields must be provided (title and description in both languages)',
      });
    }

    // Create project
    const project = await Project.create({
      title_en,
      title_fr,
      description_en,
      description_fr,
      link,
      image_url,
    });

    logger.info(`Project created by admin ${req.user.id}: ${project.project_id}`);

    return res.status(201).json({ 
      success: true, 
      message: 'Project created successfully', 
      project,
    });
  } catch (error) {
    logger.error('Create project error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while creating the project',
    });
  }
};

// Update project (Admin only)
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      title_en,
      title_fr,
      description_en,
      description_fr,
      link,
      image_url,
    } = req.body;

    // Find project
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found',
      });
    }

    // Update fields
    if (title_en !== undefined) project.title_en = title_en;
    if (title_fr !== undefined) project.title_fr = title_fr;
    if (description_en !== undefined) project.description_en = description_en;
    if (description_fr !== undefined) project.description_fr = description_fr;
    if (link !== undefined) project.link = link;
    if (image_url !== undefined) project.image_url = image_url;

    await project.save();

    logger.info(`Project updated by admin ${req.user.id}: ${projectId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Project updated successfully', 
      project,
    });
  } catch (error) {
    logger.error('Update project error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while updating the project',
    });
  }
};

// Delete project (Admin only)
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found',
      });
    }

    await project.destroy();

    logger.info(`Project deleted by admin ${req.user.id}: ${projectId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Project deleted successfully',
    });
  } catch (error) {
    logger.error('Delete project error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while deleting the project',
    });
  }
};

// Search projects
const searchProjects = async (req, res) => {
  try {
    const { query, lang = 'en', page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query is required',
      });
    }

    const offset = (page - 1) * limit;
    const { Op } = require('sequelize');

    const titleField = lang === 'fr' ? 'title_fr' : 'title_en';
    const descField = lang === 'fr' ? 'description_fr' : 'description_en';

    const { count, rows } = await Project.findAndCountAll({
      where: {
        [Op.or]: [
          { [titleField]: { [Op.iLike]: `%${query}%` } },
          { [descField]: { [Op.iLike]: `%${query}%` } },
        ],
      },
      order: [['posted_on', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    logger.info(`Search projects for "${query}": ${rows.length} results`);

    return res.status(200).json({
      success: true,
      count: rows.length,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      projects: rows,
    });
  } catch (error) {
    logger.error('Search projects error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while searching projects',
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  searchProjects,
};
