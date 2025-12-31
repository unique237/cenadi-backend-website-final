const pool = require('../config/db');
const slugify = require('slugify');

// Get all news/articles with pagination and filters
const getAllNews = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category_id, 
            is_featured, 
            author_id,
            lang = 'en' 
        } = req.query;

        const offset = (page - 1) * limit;
        let query = 'SELECT a.*, c.name_en as category_name_en, c.name_fr as category_name_fr, u.name as author_name FROM articles a LEFT JOIN categories c ON a.category_id = c.category_id LEFT JOIN users u ON a.author_id = u.user_id WHERE 1=1';
        const queryParams = [];
        let paramIndex = 1;

        if (category_id) {
            query += ` AND a.category_id = $${paramIndex}`;
            queryParams.push(category_id);
            paramIndex++;
        }

        if (is_featured !== undefined) {
            query += ` AND a.is_featured = $${paramIndex}`;
            queryParams.push(is_featured === 'true');
            paramIndex++;
        }

        if (author_id) {
            query += ` AND a.author_id = $${paramIndex}`;
            queryParams.push(author_id);
            paramIndex++;
        }

        query += ` ORDER BY a.published_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        queryParams.push(limit, offset);

        const result = await pool.query(query, queryParams);

        // Get total count
        let countQuery = 'SELECT COUNT(*) FROM articles WHERE 1=1';
        const countParams = [];
        let countParamIndex = 1;

        if (category_id) {
            countQuery += ` AND category_id = $${countParamIndex}`;
            countParams.push(category_id);
            countParamIndex++;
        }

        if (is_featured !== undefined) {
            countQuery += ` AND is_featured = $${countParamIndex}`;
            countParams.push(is_featured === 'true');
            countParamIndex++;
        }

        if (author_id) {
            countQuery += ` AND author_id = $${countParamIndex}`;
            countParams.push(author_id);
        }

        const countResult = await pool.query(countQuery, countParams);
        const totalItems = parseInt(countResult.rows[0].count);

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: parseInt(page),
            articles: result.rows
        });
    } catch (error) {
        console.error('Get all news error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching articles' 
        });
    }
};

// Get single article by slug
const getNewsBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const { lang = 'en' } = req.query;

        const slugField = lang === 'fr' ? 'slug_fr' : 'slug_en';

        const result = await pool.query(
            `SELECT a.*, c.name_en as category_name_en, c.name_fr as category_name_fr, u.name as author_name, u.email as author_email 
             FROM articles a 
             LEFT JOIN categories c ON a.category_id = c.category_id 
             LEFT JOIN users u ON a.author_id = u.user_id 
             WHERE a.${slugField} = $1`,
            [slug]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Article not found' 
            });
        }

        return res.status(200).json({
            success: true,
            article: result.rows[0]
        });
    } catch (error) {
        console.error('Get news by slug error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching article' 
        });
    }
};

// Get article by ID
const getNewsById = async (req, res) => {
    try {
        const { articleId } = req.params;

        const result = await pool.query(
            `SELECT a.*, c.name_en as category_name_en, c.name_fr as category_name_fr, u.name as author_name, u.email as author_email 
             FROM articles a 
             LEFT JOIN categories c ON a.category_id = c.category_id 
             LEFT JOIN users u ON a.author_id = u.user_id 
             WHERE a.article_id = $1`,
            [articleId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Article not found' 
            });
        }

        return res.status(200).json({
            success: true,
            article: result.rows[0]
        });
    } catch (error) {
        console.error('Get news by ID error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching article' 
        });
    }
};

// Create new article (Author or Admin)
const createNews = async (req, res) => {
    try {
        const {
            category_id,
            title_en,
            title_fr,
            excerpt_en,
            excerpt_fr,
            content_en,
            content_fr,
            image_url,
            is_featured = false
        } = req.body;

        // Validation
        if (!category_id || !title_en || !title_fr || !excerpt_en || !excerpt_fr || !content_en || !content_fr) {
            return res.status(400).json({ 
                success: false,
                message: 'All required fields must be provided (titles, excerpts, contents in both languages)' 
            });
        }

        // Generate slugs
        const slug_en = slugify(title_en, { lower: true, strict: true });
        const slug_fr = slugify(title_fr, { lower: true, strict: true });

        // Check if slugs already exist
        const slugCheck = await pool.query(
            'SELECT article_id FROM articles WHERE slug_en = $1 OR slug_fr = $2',
            [slug_en, slug_fr]
        );

        if (slugCheck.rows.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Article with similar title already exists' 
            });
        }

        const author_id = req.user.id;

        const result = await pool.query(
            `INSERT INTO articles (category_id, author_id, title_en, title_fr, slug_en, slug_fr, 
             excerpt_en, excerpt_fr, content_en, content_fr, image_url, is_featured) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [category_id, author_id, title_en, title_fr, slug_en, slug_fr, 
             excerpt_en, excerpt_fr, content_en, content_fr, image_url, is_featured]
        );

        return res.status(201).json({
            success: true,
            message: 'Article created successfully',
            article: result.rows[0]
        });
    } catch (error) {
        console.error('Create news error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while creating article' 
        });
    }
};

// Update article (Author can update own, Admin can update any)
const updateNews = async (req, res) => {
    try {
        const { articleId } = req.params;
        const {
            category_id,
            title_en,
            title_fr,
            excerpt_en,
            excerpt_fr,
            content_en,
            content_fr,
            image_url,
            is_featured
        } = req.body;

        // Check if article exists
        const checkResult = await pool.query(
            'SELECT * FROM articles WHERE article_id = $1',
            [articleId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Article not found' 
            });
        }

        const article = checkResult.rows[0];

        // Check permissions: author can update own article, admin can update any
        if (req.user.role !== 'admin' && article.author_id !== req.user.id) {
            return res.status(403).json({ 
                success: false,
                message: 'You can only update your own articles' 
            });
        }

        // Prepare update fields
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (category_id) {
            updates.push(`category_id = $${paramIndex}`);
            values.push(category_id);
            paramIndex++;
        }

        if (title_en) {
            updates.push(`title_en = $${paramIndex}`);
            values.push(title_en);
            paramIndex++;
            
            const slug_en = slugify(title_en, { lower: true, strict: true });
            updates.push(`slug_en = $${paramIndex}`);
            values.push(slug_en);
            paramIndex++;
        }

        if (title_fr) {
            updates.push(`title_fr = $${paramIndex}`);
            values.push(title_fr);
            paramIndex++;
            
            const slug_fr = slugify(title_fr, { lower: true, strict: true });
            updates.push(`slug_fr = $${paramIndex}`);
            values.push(slug_fr);
            paramIndex++;
        }

        if (excerpt_en) {
            updates.push(`excerpt_en = $${paramIndex}`);
            values.push(excerpt_en);
            paramIndex++;
        }

        if (excerpt_fr) {
            updates.push(`excerpt_fr = $${paramIndex}`);
            values.push(excerpt_fr);
            paramIndex++;
        }

        if (content_en) {
            updates.push(`content_en = $${paramIndex}`);
            values.push(content_en);
            paramIndex++;
        }

        if (content_fr) {
            updates.push(`content_fr = $${paramIndex}`);
            values.push(content_fr);
            paramIndex++;
        }

        if (image_url !== undefined) {
            updates.push(`image_url = $${paramIndex}`);
            values.push(image_url);
            paramIndex++;
        }

        if (is_featured !== undefined) {
            updates.push(`is_featured = $${paramIndex}`);
            values.push(is_featured);
            paramIndex++;
        }

        if (updates.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'No fields to update' 
            });
        }

        values.push(articleId);
        const query = `UPDATE articles SET ${updates.join(', ')} WHERE article_id = $${paramIndex} RETURNING *`;

        const result = await pool.query(query, values);

        return res.status(200).json({
            success: true,
            message: 'Article updated successfully',
            article: result.rows[0]
        });
    } catch (error) {
        console.error('Update news error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while updating article' 
        });
    }
};

// Delete article (Author can delete own, Admin can delete any)
const deleteNews = async (req, res) => {
    try {
        const { articleId } = req.params;

        // Check if article exists
        const checkResult = await pool.query(
            'SELECT * FROM articles WHERE article_id = $1',
            [articleId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Article not found' 
            });
        }

        const article = checkResult.rows[0];

        // Check permissions
        if (req.user.role !== 'admin' && article.author_id !== req.user.id) {
            return res.status(403).json({ 
                success: false,
                message: 'You can only delete your own articles' 
            });
        }

        await pool.query('DELETE FROM articles WHERE article_id = $1', [articleId]);

        return res.status(200).json({
            success: true,
            message: 'Article deleted successfully'
        });
    } catch (error) {
        console.error('Delete news error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while deleting article' 
        });
    }
};

module.exports = {
    getAllNews,
    getNewsBySlug,
    getNewsById,
    createNews,
    updateNews,
    deleteNews
};
