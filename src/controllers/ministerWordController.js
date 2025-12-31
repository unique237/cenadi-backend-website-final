const pool = require('../config/db');

const getMinisterMessage = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM finance_minister_messages LIMIT 1');
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Minister message not found' });
        }
        return res.status(200).json({ success: true, message: result.rows[0] });
    } catch (error) {
        console.error('Get minister message error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const createOrUpdateMinisterMessage = async (req, res) => {
    try {
        const {
            minister_name, content_en, content_fr, image_url, telephone, email, website
        } = req.body;

        if (!minister_name || !content_en || !content_fr) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }

        // Check if message exists
        const checkResult = await pool.query('SELECT * FROM finance_minister_messages LIMIT 1');

        let result;
        if (checkResult.rows.length > 0) {
            // Update existing
            result = await pool.query(
                `UPDATE finance_minister_messages SET minister_name = $1, content_en = $2, content_fr = $3, 
                 image_url = $4, telephone = $5, email = $6, website = $7 WHERE message_id = $8 RETURNING *`,
                [minister_name, content_en, content_fr, image_url, telephone, email, website, checkResult.rows[0].message_id]
            );
        } else {
            // Create new
            result = await pool.query(
                `INSERT INTO finance_minister_messages (minister_name, content_en, content_fr, image_url, telephone, email, website) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [minister_name, content_en, content_fr, image_url, telephone, email, website]
            );
        }

        return res.status(200).json({ success: true, message: 'Minister message saved', data: result.rows[0] });
    } catch (error) {
        console.error('Create/Update minister message error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

module.exports = { getMinisterMessage, createOrUpdateMinisterMessage };
