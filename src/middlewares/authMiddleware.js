const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Get the authorization header
    if (!authHeader) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    // Extract the token from the "Bearer <token>" format
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify the token
        req.user = decoded; // Attach decoded payload (user data) to the request object
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        console.error('JWT verification error:', error);
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};
