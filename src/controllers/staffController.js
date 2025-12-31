const pool = require('../config/db');

// Get all staff members with pagination
const getAllStaff = async (req, res) => {
    try {
        const { page = 1, limit = 20, department } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM staffs WHERE 1=1';
        const queryParams = [];
        let paramIndex = 1;

        if (department) {
            query += ` AND (department_en = $${paramIndex} OR department_fr = $${paramIndex})`;
            queryParams.push(department);
            paramIndex++;
        }

        query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        queryParams.push(limit, offset);

        const result = await pool.query(query, queryParams);

        // Get total count
        let countQuery = 'SELECT COUNT(*) FROM staffs WHERE 1=1';
        const countParams = [];
        if (department) {
            countQuery += ` AND (department_en = $1 OR department_fr = $1)`;
            countParams.push(department);
        }

        const countResult = await pool.query(countQuery, countParams);
        const totalItems = parseInt(countResult.rows[0].count);

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: parseInt(page),
            staff: result.rows
        });
    } catch (error) {
        console.error('Get all staff error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching staff' 
        });
    }
};

// Get staff by ID
const getStaffById = async (req, res) => {
    try {
        const { staffId } = req.params;

        const result = await pool.query(
            'SELECT * FROM staffs WHERE staff_id = $1',
            [staffId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Staff member not found' 
            });
        }

        return res.status(200).json({
            success: true,
            staff: result.rows[0]
        });
    } catch (error) {
        console.error('Get staff by ID error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching staff member' 
        });
    }
};

// Create staff member (Admin only)
const createStaff = async (req, res) => {
    try {
        const {
            staff_name_en,
            staff_name_fr,
            title_en,
            title_fr,
            description_en,
            description_fr,
            rank_en,
            rank_fr,
            department_en,
            department_fr,
            image_url,
            email,
            linkedin,
            x
        } = req.body;

        // Validation
        if (!staff_name_en || !staff_name_fr || !title_en || !title_fr || 
            !description_en || !description_fr || !rank_en || !rank_fr ||
            !department_en || !department_fr || !image_url) {
            return res.status(400).json({ 
                success: false,
                message: 'All required fields must be provided' 
            });
        }

        const result = await pool.query(
            `INSERT INTO staffs (staff_name_en, staff_name_fr, title_en, title_fr, 
             description_en, description_fr, rank_en, rank_fr, department_en, department_fr, 
             image_url, email, linkedin, x) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
            [staff_name_en, staff_name_fr, title_en, title_fr, description_en, description_fr, 
             rank_en, rank_fr, department_en, department_fr, image_url, email, linkedin, x]
        );

        return res.status(201).json({
            success: true,
            message: 'Staff member created successfully',
            staff: result.rows[0]
        });
    } catch (error) {
        console.error('Create staff error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while creating staff member' 
        });
    }
};

// Update staff member (Admin only)
const updateStaff = async (req, res) => {
    try {
        const { staffId } = req.params;

        // Check if staff exists
        const checkResult = await pool.query(
            'SELECT * FROM staffs WHERE staff_id = $1',
            [staffId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Staff member not found' 
            });
        }

        const currentStaff = checkResult.rows[0];
        const updates = [];
        const values = [];
        let paramIndex = 1;

        const fields = [
            'staff_name_en', 'staff_name_fr', 'title_en', 'title_fr',
            'description_en', 'description_fr', 'rank_en', 'rank_fr',
            'department_en', 'department_fr', 'image_url', 'email', 'linkedin', 'x'
        ];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates.push(`${field} = $${paramIndex}`);
                values.push(req.body[field]);
                paramIndex++;
            }
        });

        if (updates.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'No fields to update' 
            });
        }

        values.push(staffId);
        const query = `UPDATE staffs SET ${updates.join(', ')} WHERE staff_id = $${paramIndex} RETURNING *`;

        const result = await pool.query(query, values);

        return res.status(200).json({
            success: true,
            message: 'Staff member updated successfully',
            staff: result.rows[0]
        });
    } catch (error) {
        console.error('Update staff error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while updating staff member' 
        });
    }
};

// Delete staff member (Admin only)
const deleteStaff = async (req, res) => {
    try {
        const { staffId } = req.params;

        const checkResult = await pool.query(
            'SELECT * FROM staffs WHERE staff_id = $1',
            [staffId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Staff member not found' 
            });
        }

        await pool.query('DELETE FROM staffs WHERE staff_id = $1', [staffId]);

        return res.status(200).json({
            success: true,
            message: 'Staff member deleted successfully'
        });
    } catch (error) {
        console.error('Delete staff error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while deleting staff member' 
        });
    }
};

module.exports = {
    getAllStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff
};
