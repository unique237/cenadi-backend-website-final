const Category = require('../models/Category');
const Article = require('../models/Article');
const logger = require('../config/logger');

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['name_en', 'ASC']],
            attributes: ['category_id', 'name_en', 'name_fr', 'created_at', 'updated_at'],
        });

        return res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        logger.error('Get all categories error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching categories',
        });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findByPk(categoryId, {
            include: [{
                model: Article,
                as: 'articles',
                attributes: ['article_id', 'title_en', 'title_fr', 'slug_en', 'slug_fr'],
                limit: 5,
            }],
        });

        if (!category) {
            return res.status(404).json({ 
                success: false,
                message: 'Category not found',
            });
        }

        return res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        logger.error('Get category by ID error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching category',
        });
    }
};

// Create new category (Admin only)
const createCategory = async (req, res) => {
    try {
        const { name_en, name_fr } = req.body;

        // Validate input
        if (!name_en || !name_fr) {
            return res.status(400).json({ 
                success: false,
                message: 'English and French names are required',
            });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({
            where: {
                name_en,
            },
        });

        if (existingCategory) {
            return res.status(409).json({ 
                success: false,
                message: 'Category with this English name already exists',
            });
        }

        const category = await Category.create({
            name_en,
            name_fr,
        });

        logger.info(`Category created: ${category.category_id} by user ${req.user.id}`);

        return res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category,
        });
    } catch (error) {
        logger.error('Create category error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while creating category',
        });
    }
};

// Update category (Admin only)
const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name_en, name_fr } = req.body;

        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ 
                success: false,
                message: 'Category not found',
            });
        }

        // Update fields
        if (name_en) category.name_en = name_en;
        if (name_fr) category.name_fr = name_fr;

        await category.save();

        logger.info(`Category updated: ${categoryId} by user ${req.user.id}`);

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category,
        });
    } catch (error) {
        logger.error('Update category error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while updating category',
        });
    }
};

// Delete category (Admin only)
const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await Category.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({ 
                success: false,
                message: 'Category not found',
            });
        }

        // Check if category has associated articles
        const articleCount = await Article.count({
            where: { category_id: categoryId },
        });

        if (articleCount > 0) {
            return res.status(409).json({ 
                success: false,
                message: `Cannot delete category with ${articleCount} associated articles`,
            });
        }

        await category.destroy();

        logger.info(`Category deleted: ${categoryId} by user ${req.user.id}`);

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        logger.error('Delete category error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while deleting category',
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
