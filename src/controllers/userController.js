const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Sign Up Controller
const signup = async (req, res) => {
    try {
        const { username, email, name, password, passwordConfirm } = req.body;

        // Validation
        if (!username || !email || !name || !password || !passwordConfirm) {
            return res.status(400).json({ message: 'Please provide all required fields | Tout les champs sont obligatoires' });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({ message: 'Passwords do not match | Les mots de passe ne correspondent pas' });
        }

        // Check if email already exists
        const emailResult = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
        if (emailResult.rows.length > 0) {
            return res.status(400).json({ message: 'Email is already in use | L\'email est déjà utilisé' });
        }

        // Check if username already exists
        const usernameResult = await pool.query('SELECT username FROM users WHERE username = $1', [username]);
        if (usernameResult.rows.length > 0) {
            return res.status(400).json({ message: 'Username is already taken | Le nom d\'utilisateur est deja pris' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with status 'pending' and role 'author' by default
        const result = await pool.query(
            'INSERT INTO users (username, email, name, password_hash, role, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING user_id, username, email, name, role, status',
            [username, email, name, hashedPassword, 'author', 'pending']
        );

        return res.status(201).json({
            message: 'User registered successfully. Pending admin approval.',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'An error occurred during signup' });
    }
};

// Sign In Controller
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password | Veuillez fournir un email et un mot de passe' });
        }

        // Check if user exists
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Check if user status is active
        if (user.status !== 'active') {
            return res.status(403).json({
                message: `Your account is ${user.status}. Please contact administrator.`,
                status: user.status
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.user_id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Return token and user info
        return res.status(200).json({
            message: 'Logged in successfully',
            token: token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Sign in error:', error);
        return res.status(500).json({ message: 'An error occurred during signin' });
    }
};

// Get All Users (Admin only) - Admin can see all users
const getAllUsers = async (req, res) => {
    try {
        // Check if user is admin (assuming this is verified by auth middleware)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const result = await pool.query(
            'SELECT user_id, username, email, name, role, status, created_at FROM users ORDER BY created_at DESC'
        );

        return res.status(200).json({
            message: 'Users retrieved successfully',
            count: result.rows.length,
            users: result.rows
        });
    } catch (error) {
        console.error('Get all users error:', error);
        return res.status(500).json({ message: 'An error occurred while fetching users' });
    }
};

// Get User by ID
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await pool.query(
            'SELECT user_id, username, email, name, role, status, created_at FROM users WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'User retrieved successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        return res.status(500).json({ message: 'An error occurred while fetching user' });
    }
};

// Update User (Admin only) - Can update other users' role and status
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role, status } = req.body;

        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        // Prevent admin from updating their own role or status
        if (parseInt(userId) === req.user.id) {
            return res.status(400).json({ message: 'You cannot update your own role or status' });
        }

        // Validate role and status
        const validRoles = ['admin', 'author'];
        const validStatuses = ['pending', 'active', 'suspended'];

        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be admin or author' });
        }

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be pending, active, or suspended' });
        }

        // Check if user exists
        const userCheck = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const currentUser = userCheck.rows[0];
        const updateRole = role || currentUser.role;
        const updateStatus = status || currentUser.status;

        // Update user
        const result = await pool.query(
            'UPDATE users SET role = $1, status = $2 WHERE user_id = $3 RETURNING user_id, username, email, name, role, status',
            [updateRole, updateStatus, userId]
        );

        return res.status(200).json({
            message: 'User updated successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Update user error:', error);
        return res.status(500).json({ message: 'An error occurred while updating user' });
    }
};

// Delete User (Admin only)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        // Prevent admin from deleting themselves
        if (parseInt(userId) === req.user.id) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }

        // Check if user exists
        const userCheck = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user
        await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);

        return res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ message: 'An error occurred while deleting user' });
    }
};

module.exports = {
    signup,
    signin,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};