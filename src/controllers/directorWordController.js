const pool = require('../config/db');

const getDirectorMessage = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM director_messages LIMIT 1');
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Director message not found' });
        }
        return res.status(200).json({ success: true, message: result.rows[0] });
    } catch (error) {
        console.error('Get director message error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const createOrUpdateDirectorMessage = async (req, res) => {
    try {
        const {
            director_name, title_en, title_fr, excerpt_en, excerpt_fr,
            content_en, content_fr, image_url, x, linkedin, email
        } = req.body;

        if (!director_name || !title_en || !title_fr || !excerpt_en || !excerpt_fr || !content_en || !content_fr) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }

        // Check if message exists
        const checkResult = await pool.query('SELECT * FROM director_messages LIMIT 1');

        let result;
        if (checkResult.rows.length > 0) {
            // Update existing
            result = await pool.query(
                `UPDATE director_messages SET director_name = $1, title_en = $2, title_fr = $3, 
                 excerpt_en = $4, excerpt_fr = $5, content_en = $6, content_fr = $7, image_url = $8, 
                 x = $9, linkedin = $10, email = $11 WHERE message_id = $12 RETURNING *`,
                [director_name, title_en, title_fr, excerpt_en, excerpt_fr, content_en, content_fr,
                 image_url, x, linkedin, email, checkResult.rows[0].message_id]
            );
        } else {
            // Create new
            result = await pool.query(
                `INSERT INTO director_messages (director_name, title_en, title_fr, excerpt_en, excerpt_fr, 
                 content_en, content_fr, image_url, x, linkedin, email) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
                [director_name, title_en, title_fr, excerpt_en, excerpt_fr, content_en, content_fr,
                 image_url, x, linkedin, email]
            );
        }

        return res.status(200).json({ success: true, message: 'Director message saved', data: result.rows[0] });
    } catch (error) {
        console.error('Create/Update director message error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

module.exports = { getDirectorMessage, createOrUpdateDirectorMessage };
