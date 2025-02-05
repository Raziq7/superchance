import jwt from 'jsonwebtoken';
import sanitizedConfig from '../config.js';

// Middleware to verify JWT
export function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract JWT token
  
    if (!token) {
      return res.status(403).send('Token is required');
    }
  
    jwt.verify(token, sanitizedConfig.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send('Invalid token');
      }
      req.user = decoded;
      next();
    });
  }