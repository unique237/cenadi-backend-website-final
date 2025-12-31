const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const { Op } = require('sequelize');

// Signup - Create new user
const signup = async (req, res) => {
    try {
        const { username, email, name, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }],
            },
        });

        if (existingUser) {
            return res.status(409).json({ 
                success: false,
                message: 'User with this email or username already exists',
            });
        }

        // Hash password
        const password_hash = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            name,
            password_hash,
            role: 'author',
            status: 'pending',
        });

        logger.info(`New user registered: ${user.user_id} - ${user.email}`);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully. Awaiting admin approval.',
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status,
            },
        });
    } catch (error) {
        logger.error('Signup error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred during registration',
        });
    }
};

// Signin - User login
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.status(403).json({ 
                success: false,
                message: `Account is ${user.status}. Please contact admin.`,
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.user_id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        logger.info(`User logged in: ${user.user_id} - ${user.email}`);

        return res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status,
            },
        });
    } catch (error) {
        logger.error('Signin error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred during login',
        });
    }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password_hash'] },
            order: [['created_at', 'DESC']],
        });

        return res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        logger.error('Get all users error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while fetching users',
        });
    }
};

// Update user (Admin only - for role/status updates)
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role, status } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found',
            });
        }

        // Prevent admin from modifying their own status/role
        if (user.user_id === req.user.id) {
            return res.status(403).json({ 
                success: false,
                message: 'You cannot modify your own status or role',
            });
        }

        // Update fields
        if (role) user.role = role;
        if (status) user.status = status;

        await user.save();

        logger.info(`User updated: ${userId} by admin ${req.user.id}`);

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status,
            },
        });
    } catch (error) {
        logger.error('Update user error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while updating user',
        });
    }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found',
            });
        }

        // Prevent admin from deleting themselves
        if (user.user_id === req.user.id) {
            return res.status(403).json({ 
                success: false,
                message: 'You cannot delete your own account',
            });
        }

        await user.destroy();

        logger.info(`User deleted: ${userId} by admin ${req.user.id}`);

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        logger.error('Delete user error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'An error occurred while deleting user',
        });
    }
};

module.exports = {
    signup,
    signin,
    getAllUsers,
    updateUser,
    deleteUser,
};
