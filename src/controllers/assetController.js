const pool = require('../config/db');

const getAllAssets = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM assets');
        return res.status(200).json({ success: true, count: result.rows.length, assets: result.rows });
    } catch (error) {
        console.error('Get all assets error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while fetching assets' });
    }
};

const getAssetById = async (req, res) => {
    try {
        const { assetId } = req.params;
        const result = await pool.query('SELECT * FROM assets WHERE asset_id = $1', [assetId]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Asset not found' });
        return res.status(200).json({ success: true, asset: result.rows[0] });
    } catch (error) {
        console.error('Get asset by ID error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const createAsset = async (req, res) => {
    try {
        const { name_en, name_fr, description_en, description_fr, image_url } = req.body;
        if (!name_en || !name_fr || !description_en || !description_fr || !image_url) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const result = await pool.query(
            'INSERT INTO assets (name_en, name_fr, description_en, description_fr, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name_en, name_fr, description_en, description_fr, image_url]
        );
        return res.status(201).json({ success: true, message: 'Asset created', asset: result.rows[0] });
    } catch (error) {
        console.error('Create asset error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const updateAsset = async (req, res) => {
    try {
        const { assetId } = req.params;
        const checkResult = await pool.query('SELECT * FROM assets WHERE asset_id = $1', [assetId]);
        if (checkResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Asset not found' });
        
        const { name_en, name_fr, description_en, description_fr, image_url } = req.body;
        const current = checkResult.rows[0];
        const result = await pool.query(
            'UPDATE assets SET name_en = $1, name_fr = $2, description_en = $3, description_fr = $4, image_url = $5 WHERE asset_id = $6 RETURNING *',
            [name_en || current.name_en, name_fr || current.name_fr, description_en || current.description_en, 
             description_fr || current.description_fr, image_url || current.image_url, assetId]
        );
        return res.status(200).json({ success: true, message: 'Asset updated', asset: result.rows[0] });
    } catch (error) {
        console.error('Update asset error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

const deleteAsset = async (req, res) => {
    try {
        const { assetId } = req.params;
        const checkResult = await pool.query('SELECT * FROM assets WHERE asset_id = $1', [assetId]);
        if (checkResult.rows.length === 0) return res.status(404).json({ success: false, message: 'Asset not found' });
        await pool.query('DELETE FROM assets WHERE asset_id = $1', [assetId]);
        return res.status(200).json({ success: true, message: 'Asset deleted' });
    } catch (error) {
        console.error('Delete asset error:', error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

module.exports = { getAllAssets, getAssetById, createAsset, updateAsset, deleteAsset };
