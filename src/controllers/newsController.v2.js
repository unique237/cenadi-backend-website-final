const { Article, Category, User } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');
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
    } = req.query;

    const offset = (page - 1) * limit;
    
    // Build where clause
    const where = {};
    if (category_id) where.category_id = category_id;
    if (is_featured !== undefined) where.is_featured = is_featured === 'true';
    if (author_id) where.author_id = author_id;

    // Fetch articles with relations
    const { count, rows } = await Article.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['category_id', 'name_en', 'name_fr'] },
        { model: User, as: 'author', attributes: ['user_id', 'name', 'email'] },
      ],
      order: [['published_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    logger.info(`Fetched ${rows.length} articles (page ${page})`);

    return res.status(200).json({
      success: true,
      count: rows.length,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      articles: rows,
    });
  } catch (error) {
    logger.error('Get all news error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'An error occurred while fetching articles',
    });
  }
};

// Get single article by slug
const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { lang = 'en' } = req.query;

    const slugField = lang === 'fr' ? 'slug_fr' : 'slug_en';

    const article = await Article.findOne({
      where: { [slugField]: slug },
      include: [
        { model: Category, as: 'category', attributes: ['category_id', 'name_en', 'name_fr'] },
        { model: User, as: 'author', attributes: ['user_id', 'name', 'email'] },
      ],
    });

    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: 'Article not found',
      });
    }

    logger.info(`Fetched article by slug: ${slug}`);

    return res.status(200).json({ 
      success: true, 
      article,
    });
  } catch (error) {
    logger.error('Get news by slug error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred',
    });
  }
};

// Get article by ID
const getNewsById = async (req, res) => {
  try {
    const { articleId } = req.params;

    const article = await Article.findByPk(articleId, {
      include: [
        { model: Category, as: 'category', attributes: ['category_id', 'name_en', 'name_fr'] },
        { model: User, as: 'author', attributes: ['user_id', 'name', 'email'] },
      ],
    });

    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: 'Article not found',
      });
    }

    logger.info(`Fetched article by ID: ${articleId}`);

    return res.status(200).json({ 
      success: true, 
      article,
    });
  } catch (error) {
    logger.error('Get news by ID error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred',
    });
  }
};

// Create new article
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
      is_featured = false,
    } = req.body;

    // Validate required fields
    if (!category_id || !title_en || !title_fr || !content_en || !content_fr) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields missing',
      });
    }

    // Verify category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found',
      });
    }

    // Generate slugs
    const slug_en = slugify(title_en, { lower: true, strict: true });
    const slug_fr = slugify(title_fr, { lower: true, strict: true });

    // Check for duplicate slugs
    const existingArticle = await Article.findOne({
      where: {
        [Op.or]: [{ slug_en }, { slug_fr }],
      },
    });

    if (existingArticle) {
      return res.status(409).json({ 
        success: false, 
        message: 'Article with similar title already exists',
      });
    }

    // Get author from JWT token
    const author_id = req.user.id;

    // Create article
    const article = await Article.create({
      category_id,
      author_id,
      title_en,
      title_fr,
      slug_en,
      slug_fr,
      excerpt_en,
      excerpt_fr,
      content_en,
      content_fr,
      image_url,
      is_featured,
    });

    logger.info(`Article created by user ${author_id}: ${article.article_id}`);

    return res.status(201).json({ 
      success: true, 
      message: 'Article created successfully', 
      article,
    });
  } catch (error) {
    logger.error('Create news error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while creating the article',
    });
  }
};

// Update article
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
      is_featured,
    } = req.body;

    // Find article
    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: 'Article not found',
      });
    }

    // If category changed, verify new category exists
    if (category_id && category_id !== article.category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json({ 
          success: false, 
          message: 'Category not found',
        });
      }
    }

    // Update fields
    if (category_id !== undefined) article.category_id = category_id;
    if (title_en !== undefined) {
      article.title_en = title_en;
      article.slug_en = slugify(title_en, { lower: true, strict: true });
    }
    if (title_fr !== undefined) {
      article.title_fr = title_fr;
      article.slug_fr = slugify(title_fr, { lower: true, strict: true });
    }
    if (excerpt_en !== undefined) article.excerpt_en = excerpt_en;
    if (excerpt_fr !== undefined) article.excerpt_fr = excerpt_fr;
    if (content_en !== undefined) article.content_en = content_en;
    if (content_fr !== undefined) article.content_fr = content_fr;
    if (image_url !== undefined) article.image_url = image_url;
    if (is_featured !== undefined) article.is_featured = is_featured;

    await article.save();

    logger.info(`Article updated by user ${req.user.id}: ${articleId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Article updated successfully', 
      article,
    });
  } catch (error) {
    logger.error('Update news error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while updating the article',
    });
  }
};

// Delete article
const deleteNews = async (req, res) => {
  try {
    const { articleId } = req.params;

    const article = await Article.findByPk(articleId);
    if (!article) {
      return res.status(404).json({ 
        success: false, 
        message: 'Article not found',
      });
    }

    await article.destroy();

    logger.info(`Article deleted by user ${req.user.id}: ${articleId}`);

    return res.status(200).json({ 
      success: true, 
      message: 'Article deleted successfully',
    });
  } catch (error) {
    logger.error('Delete news error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while deleting the article',
    });
  }
};

// Get featured articles
const getFeaturedNews = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const articles = await Article.findAll({
      where: { is_featured: true },
      include: [
        { model: Category, as: 'category', attributes: ['category_id', 'name_en', 'name_fr'] },
        { model: User, as: 'author', attributes: ['user_id', 'name'] },
      ],
      order: [['published_at', 'DESC']],
      limit: parseInt(limit),
    });

    logger.info(`Fetched ${articles.length} featured articles`);

    return res.status(200).json({ 
      success: true, 
      count: articles.length, 
      articles,
    });
  } catch (error) {
    logger.error('Get featured news error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching featured articles',
    });
  }
};

// Search articles
const searchNews = async (req, res) => {
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
    const contentField = lang === 'fr' ? 'content_fr' : 'content_en';

    const { count, rows } = await Article.findAndCountAll({
      where: {
        [Op.or]: [
          { [titleField]: { [Op.iLike]: `%${query}%` } },
          { [contentField]: { [Op.iLike]: `%${query}%` } },
        ],
      },
      include: [
        { model: Category, as: 'category', attributes: ['category_id', 'name_en', 'name_fr'] },
        { model: User, as: 'author', attributes: ['user_id', 'name'] },
      ],
      order: [['published_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    logger.info(`Search articles for "${query}": ${rows.length} results`);

    return res.status(200).json({
      success: true,
      count: rows.length,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      articles: rows,
    });
  } catch (error) {
    logger.error('Search news error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while searching articles',
    });
  }
};

module.exports = {
  getAllNews,
  getNewsBySlug,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getFeaturedNews,
  searchNews,
};
