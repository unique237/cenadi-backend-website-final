const pool = require('../config/db');

const getAllEbooks = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ebooks ORDER BY posted_on DESC');
        return res.status(200).json({ success: true, count: result.rows.length, ebooks: result.rows });
    } catch (error) {
        console.error('Get all ebooks error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while fetching ebooks' });
    }
};

const getEbookById = async (req, res) => {
    try {
        const { ebookId } = req.params;
        const result = await pool.query('SELECT * FROM ebooks WHERE book_id = $1', [ebookId]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Ebook not found' });
        return res.status(200).json({ success: true, ebook: result.rows[0] });
    } catch (error) {
        console.error('Get ebook by ID error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const createEbook = async (req, res) => {
    try {
        const { image_url, title_en, title_fr, description_en, description_fr, link } = req.body;
        if (!image_url || !title_en || !title_fr || !description_en || !description_fr) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }
        const result = await pool.query(
            'INSERT INTO ebooks (image_url, title_en, title_fr, description_en, description_fr, link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [image_url, title_en, title_fr, description_en, description_fr, link]
        );
        return res.status(201).json({ success: true, message: 'Ebook created', ebook: result.rows[0] });
    } catch (error) {
        console.error('Create ebook error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const updateEbook = async (req, res) => {
    try {
        const { ebookId } = req.params;
        const checkResult = await pool.query('SELECT * FROM ebooks WHERE book_id = $1', [ebookId]);
        if (checkResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Ebook not found' });
        
        const { image_url, title_en, title_fr, description_en, description_fr, link } = req.body;
        const current = checkResult.rows[0];
        const result = await pool.query(
            'UPDATE ebooks SET image_url = $1, title_en = $2, title_fr = $3, description_en = $4, description_fr = $5, link = $6 WHERE book_id = $7 RETURNING *',
            [image_url || current.image_url, title_en || current.title_en, title_fr || current.title_fr, 
             description_en || current.description_en, description_fr || current.description_fr, link || current.link, ebookId]
        );
        return res.status(200).json({ success: true, message: 'Ebook updated', ebook: result.rows[0] });
    } catch (error) {
        console.error('Update ebook error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const deleteEbook = async (req, res) => {
    try {
        const { ebookId } = req.params;
        const checkResult = await pool.query('SELECT * FROM ebooks WHERE book_id = $1', [ebookId]);
        if (checkResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Ebook not found' });
        await pool.query('DELETE FROM ebooks WHERE book_id = $1', [ebookId]);
        return res.status(200).json({ success: true, message: 'Ebook deleted' });
    } catch (error) {
        console.error('Delete ebook error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

module.exports = { getAllEbooks, getEbookById, createEbook, updateEbook, deleteEbook };
