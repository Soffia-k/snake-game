const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }
    
    try {
        
        const authHeader = req.headers.authorization
        
        if (!authHeader) {
            console.log('No Authorization header')
            return res.status(401).json({ message: 'No authorization' })
        }
        
        const token = authHeader.split(' ')[1]
        console.log('Token received')
        
        if (!token) {
            console.log('No token in header')
            return res.status(401).json({ message: 'No authorization' })
        }
    
        const jwtSecret = config.get('jwtSecret');
        
        const decoded = jwt.verify(token, jwtSecret)
        req.user = {
            userId: decoded.userId
        }
        
        next()
        
    } catch (e) {
        console.error('Auth middleware error:', e.message)
        
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' })
        }
        
        if (e.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' })
        }
        
        res.status(401).json({ message: 'No authorization' })
    }
};