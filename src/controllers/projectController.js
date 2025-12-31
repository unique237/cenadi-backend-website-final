const pool = require('../config/db');

// Get all projects with pagination
const getAllProjects = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const result = await pool.query(
            'SELECT * FROM projects ORDER BY posted_on DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        // Get total count
        const countResult = await pool.query('SELECT COUNT(*) FROM projects');
        const totalItems = parseInt(countResult.rows[0].count);

        return res.status(200).json({
            success: true,
            count: result.rows.length,
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: parseInt(page),
            projects: result.rows
        });
    } catch (error) {
        console.error('Get all projects error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching projects' 
        });
    }
};

// Get project by ID
const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;

        const result = await pool.query(
            'SELECT * FROM projects WHERE project_id = $1',
            [projectId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Project not found' 
            });
        }

        return res.status(200).json({
            success: true,
            project: result.rows[0]
        });
    } catch (error) {
        console.error('Get project by ID error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching project' 
        });
    }
};

// Create new project (Admin only)
const createProject = async (req, res) => {
    try {
        const {
            title_en,
            title_fr,
            description_en,
            description_fr,
            link = 'https://cenadi.cm/en/contact/'
        } = req.body;

        // Validation
        if (!title_en || !title_fr || !description_en || !description_fr) {
            return res.status(400).json({ 
                success: false,
                message: 'All required fields must be provided (title and description in both languages)' 
            });
        }

        const result = await pool.query(
            `INSERT INTO projects (title_en, title_fr, description_en, description_fr, link) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title_en, title_fr, description_en, description_fr, link]
        );

        return res.status(201).json({
            success: true,
            message: 'Project created successfully',
            project: result.rows[0]
        });
    } catch (error) {
        console.error('Create project error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while creating project' 
        });
    }
};

// Update project (Admin only)
const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const {
            title_en,
            title_fr,
            description_en,
            description_fr,
            link
        } = req.body;

        // Check if project exists
        const checkResult = await pool.query(
            'SELECT * FROM projects WHERE project_id = $1',
            [projectId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Project not found' 
            });
        }

        // Prepare update fields
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (title_en) {
            updates.push(`title_en = $${paramIndex}`);
            values.push(title_en);
            paramIndex++;
        }

        if (title_fr) {
            updates.push(`title_fr = $${paramIndex}`);
            values.push(title_fr);
            paramIndex++;
        }

        if (description_en) {
            updates.push(`description_en = $${paramIndex}`);
            values.push(description_en);
            paramIndex++;
        }

        if (description_fr) {
            updates.push(`description_fr = $${paramIndex}`);
            values.push(description_fr);
            paramIndex++;
        }

        if (link) {
            updates.push(`link = $${paramIndex}`);
            values.push(link);
            paramIndex++;
        }

        if (updates.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'No fields to update' 
            });
        }

        values.push(projectId);
        const query = `UPDATE projects SET ${updates.join(', ')} WHERE project_id = $${paramIndex} RETURNING *`;

        const result = await pool.query(query, values);

        return res.status(200).json({
            success: true,
            message: 'Project updated successfully',
            project: result.rows[0]
        });
    } catch (error) {
        console.error('Update project error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while updating project' 
        });
    }
};

// Delete project (Admin only)
const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Check if project exists
        const checkResult = await pool.query(
            'SELECT * FROM projects WHERE project_id = $1',
            [projectId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Project not found' 
            });
        }

        await pool.query('DELETE FROM projects WHERE project_id = $1', [projectId]);

        return res.status(200).json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        console.error('Delete project error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while deleting project' 
        });
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};
