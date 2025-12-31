const pool = require('../config/db');

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM categories ORDER BY name_en ASC'
        );

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            categories: result.rows
        });
    } catch (error) {
        console.error('Get all categories error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching categories' 
        });
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const result = await pool.query(
            'SELECT * FROM categories WHERE category_id = $1',
            [categoryId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Category not found' 
            });
        }

        return res.status(200).json({
            success: true,
            category: result.rows[0]
        });
    } catch (error) {
        console.error('Get category by ID error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching category' 
        });
    }
};

// Create new category (Admin only)
const createCategory = async (req, res) => {
    try {
        const { name_en, name_fr } = req.body;

        if (!name_en || !name_fr) {
            return res.status(400).json({ 
                success: false,
                message: 'Both English and French names are required' 
            });
        }

        const result = await pool.query(
            'INSERT INTO categories (name_en, name_fr) VALUES ($1, $2) RETURNING *',
            [name_en, name_fr]
        );

        return res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category: result.rows[0]
        });
    } catch (error) {
        console.error('Create category error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while creating category' 
        });
    }
};

// Update category (Admin only)
const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name_en, name_fr } = req.body;

        if (!name_en && !name_fr) {
            return res.status(400).json({ 
                success: false,
                message: 'At least one field (name_en or name_fr) must be provided' 
            });
        }

        // Check if category exists
        const checkResult = await pool.query(
            'SELECT * FROM categories WHERE category_id = $1',
            [categoryId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Category not found' 
            });
        }

        const currentCategory = checkResult.rows[0];
        const updatedNameEn = name_en || currentCategory.name_en;
        const updatedNameFr = name_fr || currentCategory.name_fr;

        const result = await pool.query(
            'UPDATE categories SET name_en = $1, name_fr = $2 WHERE category_id = $3 RETURNING *',
            [updatedNameEn, updatedNameFr, categoryId]
        );

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category: result.rows[0]
        });
    } catch (error) {
        console.error('Update category error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while updating category' 
        });
    }
};

// Delete category (Admin only)
const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Check if category exists
        const checkResult = await pool.query(
            'SELECT * FROM categories WHERE category_id = $1',
            [categoryId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Category not found' 
            });
        }

        // Check if category is used in articles
        const articlesCheck = await pool.query(
            'SELECT COUNT(*) FROM articles WHERE category_id = $1',
            [categoryId]
        );

        if (parseInt(articlesCheck.rows[0].count) > 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Cannot delete category that is used in articles' 
            });
        }

        await pool.query('DELETE FROM categories WHERE category_id = $1', [categoryId]);

        return res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while deleting category' 
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
