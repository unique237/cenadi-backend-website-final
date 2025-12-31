const pool = require('../config/db');

const getAllPartners = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM partners ORDER BY added_on DESC');
        return res.status(200).json({ success: true, count: result.rows.length, partners: result.rows });
    } catch (error) {
        console.error('Get all partners error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while fetching partners' });
    }
};

const getPartnerById = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const result = await pool.query('SELECT * FROM partners WHERE partner_id = $1', [partnerId]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Partner not found' });
        return res.status(200).json({ success: true, partner: result.rows[0] });
    } catch (error) {
        console.error('Get partner by ID error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const createPartner = async (req, res) => {
    try {
        const { name_en, name_fr, description_en, description_fr, logo_url, website } = req.body;
        if (!name_en || !name_fr || !description_en || !description_fr || !logo_url) {
            return res.status(400).json({ success: false, message: 'Required fields missing' });
        }
        const result = await pool.query(
            'INSERT INTO partners (name_en, name_fr, description_en, description_fr, logo_url, website) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name_en, name_fr, description_en, description_fr, logo_url, website]
        );
        return res.status(201).json({ success: true, message: 'Partner created', partner: result.rows[0] });
    } catch (error) {
        console.error('Create partner error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const updatePartner = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const checkResult = await pool.query('SELECT * FROM partners WHERE partner_id = $1', [partnerId]);
        if (checkResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Partner not found' });
        
        const { name_en, name_fr, description_en, description_fr, logo_url, website } = req.body;
        const current = checkResult.rows[0];
        const result = await pool.query(
            'UPDATE partners SET name_en = $1, name_fr = $2, description_en = $3, description_fr = $4, logo_url = $5, website = $6 WHERE partner_id = $7 RETURNING *',
            [name_en || current.name_en, name_fr || current.name_fr, description_en || current.description_en, 
             description_fr || current.description_fr, logo_url || current.logo_url, website || current.website, partnerId]
        );
        return res.status(200).json({ success: true, message: 'Partner updated', partner: result.rows[0] });
    } catch (error) {
        console.error('Update partner error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const deletePartner = async (req, res) => {
    try {
        const { partnerId } = req.params;
        const checkResult = await pool.query('SELECT * FROM partners WHERE partner_id = $1', [partnerId]);
        if (checkResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Partner not found' });
        await pool.query('DELETE FROM partners WHERE partner_id = $1', [partnerId]);
        return res.status(200).json({ success: true, message: 'Partner deleted' });
    } catch (error) {
        console.error('Delete partner error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

module.exports = { getAllPartners, getPartnerById, createPartner, updatePartner, deletePartner };