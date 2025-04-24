const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminAuth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'No authentication token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        try {
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId }
            });

            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            // Check if user is admin
            if (user.role !== 'ADMIN') {
                return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
            }

            // Add user to request object
            req.user = user;
            next();
        } catch (dbError) {
            console.error('Admin auth middleware - Database error:', dbError);
            throw dbError;
        }
    } catch (error) {
        console.error('Admin auth middleware - Error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

module.exports = adminAuth; 