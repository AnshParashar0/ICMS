/**
 * Admin role middleware — gates routes to ADMIN users only.
 * Must be used AFTER the auth middleware (req.user must be set).
 */
const admin = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

module.exports = admin;
