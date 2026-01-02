const express = require('express');
const router = express.Router();
const {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController.v2');
const { verifyToken, adminOnly } = require('../middleware/auth');

router.get('/staffs', getAllStaff);
router.get('/staffs/:staffId', getStaffById);
router.post('/staffs', verifyToken, adminOnly, createStaff);
router.put('/staffs/:staffId', verifyToken, adminOnly, updateStaff);
router.delete('/staffs/:staffId', verifyToken, adminOnly, deleteStaff);

module.exports = router;
