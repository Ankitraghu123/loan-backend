const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const AdminModel = require('../models/AdminModel');
const BusinessAssociatesModel = require('../models/BusinessAssociatesModel');

const isAdmin = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent as "Bearer <token>"
      console.log(token)
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
  
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret or key
  
      // Find user and check if they are an admin
      const admin = await AdminModel.findById(decoded.id);
      if (!admin) { // Assuming you have an isAdmin field or similar in your model
        return res.status(403).json({ message: 'Access denied' });
      }
  
      // Attach user to the request object
      req.admin = admin;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
  };

  const isAssociate = asyncHandler(async (req, res, next) => {
    try {
      // Extract token from Authorization header
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
  
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Check if the user is an admin
      const admin = await AdminModel.findById(decoded.id);
      if (admin) {
        // Allow access if the user is an admin
        req.admin = admin;
        return next();
      }
  
      // Check if the user is a business associate
      const associate = await BusinessAssociatesModel.findById(decoded.id);
      if (associate && associate.role === 'associate') {
        // Allow access if the user is an associate
        req.associate = associate;
        return next();
      }
  
      // If neither an admin nor an associate, deny access
      return res.status(403).json({ message: 'Access denied. Only associates and admins can access this route.' });
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token', error: error.message });
    }
  });


module.exports = { isAdmin,isAssociate};
