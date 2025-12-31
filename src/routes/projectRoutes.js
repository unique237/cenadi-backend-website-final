const express = require('express');
const router = express.Router();
const {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

// Public Routes
router.get('/projects', getAllProjects);
router.get('/projects/:projectId', getProjectById);

// Admin Only Routes
router.post('/projects', verifyToken, adminOnly, createProject);
router.put('/projects/:projectId', verifyToken, adminOnly, updateProject);
router.delete('/projects/:projectId', verifyToken, adminOnly, deleteProject);

module.exports = router;
