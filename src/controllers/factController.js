const pool = require('../config/db');

const getAllFacts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM facts ORDER BY posted_on DESC');
        return res.status(200).json({ success: true, count: result.rows.length, facts: result.rows });
    } catch (error) {
        console.error('Get all facts error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while fetching facts' });
    }
};

const getFactById = async (req, res) => {
    try {
        const { factId } = req.params;
        const result = await pool.query('SELECT * FROM facts WHERE fact_id = $1', [factId]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Fact not found' });
        return res.status(200).json({ success: true, fact: result.rows[0] });
    } catch (error) {
        console.error('Get fact by ID error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const createFact = async (req, res) => {
    try {
        const { content_en, content_fr } = req.body;
        if (!content_en || !content_fr) {
            return res.status(400).json({ success: false, message: 'Content in both languages required' });
        }
        const result = await pool.query(
            'INSERT INTO facts (content_en, content_fr) VALUES ($1, $2) RETURNING *',
            [content_en, content_fr]
        );
        return res.status(201).json({ success: true, message: 'Fact created', fact: result.rows[0] });
    } catch (error) {
        console.error('Create fact error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const updateFact = async (req, res) => {
    try {
        const { factId } = req.params;
        const { content_en, content_fr } = req.body;
        const checkResult = await pool.query('SELECT * FROM facts WHERE fact_id = $1', [factId]);
        if (checkResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Fact not found' });
        
        const current = checkResult.rows[0];
        const result = await pool.query(
            'UPDATE facts SET content_en = $1, content_fr = $2 WHERE fact_id = $3 RETURNING *',
            [content_en || current.content_en, content_fr || current.content_fr, factId]
        );
        return res.status(200).json({ success: true, message: 'Fact updated', fact: result.rows[0] });
    } catch (error) {
        console.error('Update fact error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const deleteFact = async (req, res) => {
    try {
        const { factId } = req.params;
        const checkResult = await pool.query('SELECT * FROM facts WHERE fact_id = $1', [factId]);
        if (checkResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Fact not found' });
        await pool.query('DELETE FROM facts WHERE fact_id = $1', [factId]);
        return res.status(200).json({ success: true, message: 'Fact deleted' });
    } catch (error) {
        console.error('Delete fact error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

module.exports = { getAllFacts, getFactById, createFact, updateFact, deleteFact };
